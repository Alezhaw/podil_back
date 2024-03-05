const ApiError = require("../../error/ApiError");
const CitiesWithRegService = require("../../services/trails/citiesWithRegionsService");
const RegionService = require("../../services/trails/regionService");
const { Op } = require("sequelize");

class CitiesWithRegController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CitiesWithRegService.getAll(country));
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

    const cities = await CitiesWithRegService.getByWhere(country, where);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async getByRegion(req, res, next) {
    const { country, region_id, city_name } = req.body;
    if (!country || !region_id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let where = {
      region_id,
      relevance_status: true,
    };

    if (city_name) {
      where.city_name = city_name;
    }

    const allCitiesWithRegions = await CitiesWithRegService.getByWhereForRegion(country, where);

    if (!allCitiesWithRegions[0]) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json(allCitiesWithRegions);
  }

  async getByName(req, res, next) {
    const { country, search } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    if (search) {
      actions.push({ city_name: { [Op.iLike]: `%${search}%` } }, { additional_city_name: { [Op.iLike]: `%${search}%` } });
    }
    let where = {};
    if (!!actions[0]) {
      where = {
        [Op.or]: actions,
      };
    }
    where.relevance_status = true;

    const cities = await CitiesWithRegService.getByWhereWithLimit(country, where, 30);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    const { country, city } = req.body;

    if (!country || (!city.region && !city.region_id) || !city.city_name) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkRegion = city.region ? await RegionService.getByName(country, city.region) : await RegionService.getById(country, city.region_id);
    if (!checkRegion) {
      return next(ApiError.badRequest("Такого региона нет"));
    }
    let where = {
      city_name: city.city_name,
      region_id: checkRegion.dataValues.id,
      relevance_status: true,
    };

    const checkCity = await CitiesWithRegService.getByWhere(country, where);
    if (checkCity[0]) {
      return next(ApiError.badRequest("Такой город уже есть"));
    }
    try {
      const newCity = await CitiesWithRegService.create({ country, city: { ...city, region_id: checkRegion.dataValues.id } });
      return res.json(newCity);
    } catch (e) {
      console.log(1, e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { country, city } = req.body;

    if (!country || !city.city_name || (!city.region && !city.region_id)) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkRegion = city.region ? await RegionService.getByName(country, city.region) : await RegionService.getById(country, city.region_id);
    if (!checkRegion) {
      return next(ApiError.badRequest("Такого региона нет"));
    }
    const checkCityId = await CitiesWithRegService.getById(country, city.id);
    if (!checkCityId) {
      return next(ApiError.badRequest("Города с таким id не существует"));
    }
    let where = {
      [Op.and]: [{ city_name: city.city_name }, { region_id: checkRegion.dataValues.id }, { relevance_status: true }, { id: { [Op.ne]: city.id } }],
    };
    const checkCity = await CitiesWithRegService.getByWhere(country, where);
    if (checkCity[0]) {
      return next(ApiError.badRequest("Такой город уже есть"));
    }
    try {
      const updatedCity = await CitiesWithRegService.update({ country, city: { ...city, region_id: checkRegion.dataValues.id } });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async removeByRegion(req, res, next) {
    const { country, region_id, relevance_status } = req.body;
    if (!country || !region_id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await CitiesWithRegService.getById(country, region_id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCitiesWithReg = await CitiesWithRegService.removeByRegion(country, !!relevance_status, region_id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { city, country } = req.body;
    if (!country || !city.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await CitiesWithRegService.getById(country, city.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCity = await CitiesWithRegService.remove(country, !!city.relevance_status, city.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async delete(req, res, next) {
    const { country, id } = req.body;

    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkCityId = await CitiesWithRegService.getById(country, id);
    if (!checkCityId) {
      return next(ApiError.badRequest("Города с таким id не существует"));
    }
    try {
      await CitiesWithRegService.delete(country, id);
      return res.json({ ...checkCityId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new CitiesWithRegController();
