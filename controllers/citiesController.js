const ApiError = require("../error/ApiError");
const CityService = require("../services/cityService");
const ListService = require("../services/lists/listService");
const CityHelper = require("../utils/cityHelper");
const { Op } = require("sequelize");

class CitiesController {
  async create(req, res, next) {
    let user = req.user;
    const { data, country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    let result = await CityService.UpdateOrCreate(data, user, country);
    return res.json(result);
  }

  async createByTrails(req, res, next) {
    let user = req.user;
    const { country, data, status } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    console.log(1, status);
    let result = await CityService.UpdateOrCreateByTrails({ country, data, user, status });

    return res.json(result);
  }

  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CityService.GetAll(country));
  }

  async getMaxIdForBase(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    return res.json(await CityService.getMaxIdForBase(country));
  }

  async fixDate(req, res) {
    // await CityService.fixDate();
    return res.json(123);
  }

  async getFilteredCities(req, res, next) {
    const { search, filter, sort, pageSize, page, country } = req.body;
    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }

    const result = await CityService.GetFiltered({
      search,
      filter,
      sort,
      pageSize,
      page,
      country,
    });

    return res.json({ ...result });
  }

  async getByTrail(req, res, next) {
    const { trailId, calling_scheme, country } = req.body;
    if (!trailId || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkCity = await CityService.GetTimeByTrailIdAndScheme(trailId, calling_scheme, country);
    if (!checkCity) {
      return next(ApiError.badRequest("City not found"));
    }
    return res.json(checkCity);
  }

  async getOneCity(req, res, next) {
    const { id, id_for_base, country } = req.body;

    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    let city = id ? await CityService.GetTimeById(id, country) : await CityService.GetTimes(id_for_base, country);
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    if (!!city[0]) {
      let options = [];

      city.map((el) => {
        el = el.dataValues;
        options.push({
          id_for_base: el.id_for_base,
        });
      });

      let whereWithProperties = {
        [Op.or]: options,
      };

      let citiesWithLists = CityHelper.changeCitiesTime(city);
      let lists = await ListService.getDistinctFiltered(country, whereWithProperties);
      lists = lists?.filter((el) => el?.dataValues?.time);
      lists = await Promise.all(
        lists?.map(async (el) => {
          el = el.dataValues;
          return { ...el, coming: await ListService.getForCount(country, { id_for_base: el.id_for_base, time: el.time, who_called: el.who_called }) };
        })
      );
      citiesWithLists = citiesWithLists?.map((city) => ({
        ...city,
        coming: lists?.filter((list) => list.id_for_base === city.id_for_base && list.time === city.time)?.reduce((acc, el) => `${el.coming} (${el.who_called})${acc ? ` / ${acc}` : ""}`, ""),
      }));
      return res.json(citiesWithLists);
    }
    return res.json(CityHelper.changeCitiesTime(city));
  }

  async changeCheck(req, res, next) {
    const { id, id_for_base, check_base, check_speaker, check_scenario, country } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    if (typeof (check_base ?? check_speaker ?? check_scenario) !== "boolean") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    try {
      let result = await CityService.ChangeCheck(id, id_for_base, check_base, check_speaker, check_scenario, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async changeStatus(req, res, next) {
    const { id, id_for_base, status, country, trailId } = req.body;
    let user = req.user;
    if (!id && !id_for_base && !trailId) {
      return next(ApiError.badRequest("Укажите id или id_for_base или trailId"));
    }
    if (typeof status !== "number") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    try {
      let result = await CityService.ChangeStatus(id, id_for_base, status, user, country, trailId);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteCity(req, res, next) {
    const { id_for_base, country } = req.body;
    let user = req.user;
    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    try {
      let result = await CityService.DeleteCity(id_for_base, user, country);
      await ListService.removeByIdForBase(country, false, id_for_base);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteTime(req, res, next) {
    const { id, country } = req.body;
    let user = req.user;

    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }

    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    try {
      let result = await CityService.DeleteTime(id, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async test(req, res, next) {
    const { inProgress, canceled, zamkniete, search, country } = req.body;
    try {
      let result = await CityService.GetFiltered(inProgress, canceled, zamkniete, "test", country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CitiesController();
