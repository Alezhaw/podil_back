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

    const cities = await CitiesWithRegService.getByWhereWithLimit(country, where, 20);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    const { country, region, city_name, additional_city_name, county, city_type, population, autozonning } = req.body;

    if (!country || !region || !city_name) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkRegion = await RegionService.getByName(country, region);
    if (!checkRegion) {
      return next(ApiError.badRequest("Такого региона нет"));
    }
    let where = {
      autozonning: autozonning,
    };

    const checkCity = await CitiesWithRegService.getByWhere(country, where);
    if (checkCity[0]) {
      return next(ApiError.badRequest("Такой автозонинг уже есть"));
    }
    try {
      const newCity = await CitiesWithRegService.create({ country, region_id: checkRegion.dataValues.id, city_name, additional_city_name, county, city_type, population, autozonning });
      return res.json(newCity);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    //проверить записывается ли регион ид
    const { country, id, region, region_id, city_name, additional_city_name, county, city_type, population, autozonning } = req.body;

    if (!country || city_name || (!region && !region_id)) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkRegion = region ? await RegionService.getByName(country, region) : await RegionService.getById(country, region_id);
    if (!checkRegion) {
      return next(ApiError.badRequest("Такого региона нет"));
    }
    const checkCity = await CitiesWithRegService.getById(country, id);
    if (!checkCity) {
      return next(ApiError.badRequest("Города с таким id не существует"));
    }
    try {
      const updatedCity = await CitiesWithRegService.update({ country, id, region_id: checkRegion.dataValues.id, city_name, additional_city_name, county, city_type, population, autozonning });
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
      const updatedCitiesWithReg = await CitiesWithRegService.remove(country, !!relevance_status, region_id);
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
