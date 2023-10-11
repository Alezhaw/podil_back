const ApiError = require("../../error/ApiError");
const DepartureService = require("../../services/trails/departureService");
const DepartureDateService = require("../../services/trails/departureDateService");
const CitiesWithRegService = require("../../services/trails/citiesWithRegionsService");
const TrailsService = require("../../services/trails/trailsService");
const { Op } = require("sequelize");
const sequelize = require("../../db");

class DepartureController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await DepartureService.getAll(country));
  }

  async getByIds(req, res, next) {
    const { country, ids } = req.body;
    if (!country || !ids[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    ids.map((id) => actions.push({ id }));

    let where = {
      [Op.or]: actions,
    };

    const departures = await DepartureService.getByWhere(country, where);

    if (!departures[0]) {
      return next(ApiError.internal("Выезды не найдены"));
    }
    return res.json({ departures });
  }

  async getFiltered(req, res, next) {
    const { country, dateFrom, dateTo, search, planningPersonIds, sort, pageSize, page } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }

    let departures = await DepartureService.GetFiltered(country, {}, page, pageSize, sort);

    if (!departures) {
      return next(ApiError.internal("Выезды не найдены"));
    }
    let idsForDates = (departures || [])?.map((item) => item.dataValues.id);

    let whereForDate = {};

    let dateFilter = [];
    if (dateTo) {
      dateFilter.push({ [Op.lte]: dateTo });
    }
    if (dateFrom) {
      dateFilter.push({ [Op.gte]: dateFrom });
    }
    if (dateFilter[0]) {
      whereForDate.data = {
        [Op.and]: dateFilter,
      };
    } else {
      whereForDate.departure_id = {
        [Op.or]: idsForDates,
      };
    }

    let departureDates = await DepartureDateService.getByWhere(country, whereForDate);
    let trails_id = (departureDates || []).map((item) => item.dataValues.trails_id).flat();

    let whereForTrails = {};
    if (!!planningPersonIds[0]) {
      whereForTrails.planning_person_id = {
        [Op.or]: planningPersonIds,
      };
    }
    let citiesId = [];
    if (search) {
      const whereForCity = {
        city_name: { [Op.iLike]: `%${search}%` },
      };
      const cities = await CitiesWithRegService.getByWhere(country, whereForCity);
      cities.map((city) => {
        city = city.dataValues;
        citiesId.push(city.id);
      });
      if (!citiesId[0]) {
        return next(ApiError.badRequest("Город не найден"));
      }
      whereForTrails.city_id = {
        [Op.or]: citiesId,
      };
    } else {
      whereForTrails.id = {
        [Op.or]: trails_id,
      };
    }
    if (dateFilter[0]) {
      whereForTrails.id = {
        [Op.or]: trails_id,
      };
    }
    whereForTrails.relevance_status = true;

    const finalDepartureIds = await TrailsService.GetDistinctFiltered(country, whereForTrails, page, pageSize, sort);
    let finalDepartureIdsForCount = await TrailsService.GetDistinctFilteredForCount(country, whereForTrails);
    if (!finalDepartureIds[0]) {
      return next(ApiError.badRequest("Трасы не найдены"));
    }
    const idsForDepartures = finalDepartureIds.map((el) => el.dataValues.departure_id);
    let whereForDeparture = {};
    if (!dateFilter[0] && !search) {
      finalDepartureIdsForCount = await DepartureService.getByWhereWithSort(country, {}, sort);
    } else {
      whereForDeparture.id = {
        [Op.or]: idsForDepartures,
      };
      departures = await DepartureService.getByWhereWithSort(country, whereForDeparture, sort);
      if (!departures[0] || !finalDepartureIdsForCount) {
        return next(ApiError.badRequest("Выезды не найдены"));
      }
    }

    const count = Math.ceil(finalDepartureIdsForCount?.length / pageSize);
    whereForDate.departure_id = {
      [Op.or]: departures.map((item) => item.dataValues.id),
    };
    departureDates = await DepartureDateService.getByWhere(country, whereForDate);
    if (!departureDates[0]) {
      return next(ApiError.badRequest("Departure date не найдены"));
    }
    whereForTrails = {
      relevance_status: true,
      id: {
        [Op.or]: departureDates.map((item) => item.dataValues.trails_id).flat(),
      },
    };
    if (citiesId[0]) {
      whereForTrails.city_id = {
        [Op.or]: citiesId,
      };
    }
    if (!!planningPersonIds[0]) {
      whereForTrails.planning_person_id = {
        [Op.or]: planningPersonIds,
      };
    }
    const trails = await TrailsService.getByWhere(country, whereForTrails);
    if (!trails[0]) {
      return next(ApiError.badRequest("Трассы не найдены"));
    }
    // distinct используется если есть только search, получаем departure dates с фильтром по датам, потом грузим все трассы по ид departure dates которые соответствуют cityId если есть search, без лимита

    return res.json({ trails, departure: departures, departureDate: departureDates, count });
  }

  async create(req, res, next) {
    const { departure, country } = req.body;
    if (!departure || !country || !departure.dates || !departure.range) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    try {
      const newDeparture = await DepartureService.create({ country, departure });
      if (newDeparture) {
        const departureForDates = newDeparture.dataValues;
        let departureDates = departureForDates.dates.map((item) => ({ data: item, trails_id: [], departure_id: departureForDates.id }));
        try {
          console.log(1, departureDates);
          Promise.all(departureDates.map(async (departureDate) => DepartureDateService.create({ country, departureDate })));
          console.log(2, departureDates);
        } catch (e) {
          return next(ApiError.badRequest("Ошибка создания дат"));
        }
      }
      return res.json(newDeparture);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { departure, country } = req.body;

    if (!departure || !country || !departure.id || !departure.dates || !departure.range) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkDeparture = await DepartureService.getById(country, departure.id);
    if (!checkDeparture) {
      return next(ApiError.badRequest("Выезда с таким id не существует"));
    }
    try {
      const updatedDepartures = await DepartureService.update({ country, departure });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res) {
    const { id, country, relevance_status } = req.body;
    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await DepartureService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedDepartures = await DepartureService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new DepartureController();
