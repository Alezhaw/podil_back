const ApiError = require("../error/ApiError");
const { Region } = require("../models/models");
const sequelize = require("../db");
const CitiesWithRegService = require("../services/citiesWithRegionsService");
const RegionService = require("../services/regionService");

class CitiesWithRegController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CitiesWithRegService.getAll(country));
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
    let where = {
      [Op.or]: actions,
    };

    const cities = await CitiesWithRegService.getByName(country, where);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    //проверить записывается ли регион ид
    const { country, region, city_name, additional_city_name, county, city_type, population, autozonning, values } = req.body;

    const result = await Promise.all(
      values?.map(async (item) => {
        const checkRegion = await RegionService.getByName(country, item.region);
        if (!checkRegion) {
          return next(ApiError.badRequest("Такого региона нет"));
        }
        try {
          const newCity = await CitiesWithRegService.create({ country, region_id: checkRegion.dataValues.id, city_name, additional_city_name, county, city_type, population, autozonning });
          return 1;
        } catch (e) {
          return 2;
        }
      })
    );

    return res.json(result);

    // if (!country || !region || city_name) {
    //   return next(ApiError.badRequest("Укажите все данные"));
    // }
    // const checkRegion = await RegionService.getByName(country, region);
    // if (!checkRegion) {
    //   return next(ApiError.badRequest("Такого региона нет"));
    // }
    // try {
    //   const newCity = await CitiesWithRegService.create({ country, region_id: checkRegion.dataValues.id, city_name, additional_city_name, county, city_type, population, autozonning });
    //   return res.json(newCity);
    // } catch (e) {
    //   return next(ApiError.badRequest("Непредвиденная ошибка"));
    // }
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
