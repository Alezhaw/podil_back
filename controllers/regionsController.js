const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const RegionService = require("../services/regionService");

class RegionsController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await RegionService.GetAll(country));
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

    const regions = await RegionService.getByIds(country, where);

    if (!regions) {
      return next(ApiError.internal("Регионы не найдены"));
    }
    return res.json({ regions });
  }

  async create(req, res, next) {
    const { region, country } = req.body;
    if (!region || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkRegion = await RegionService.getByName(country, region);
    if (checkRegion) {
      return next(ApiError.badRequest("Регион с таким именем уже существует"));
    }
    try {
      const newRegion = await RegionService.create(country, region);
      return res.json(newRegion);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { region, country, id } = req.body;

    if (!region || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkRegionName = await RegionService.getByName(country, region);
    if (checkRegionName) {
      return next(ApiError.badRequest("Регион с таким именем уже существует"));
    }
    const checkRegionId = await RegionService.getById(country, id);
    if (!checkRegionId) {
      return next(ApiError.badRequest("Региона с таким id не существует"));
    }
    try {
      const updatedRegions = await RegionService.update(country, region, id);
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

    const checkRegionId = await RegionService.getById(country, id);
    if (!checkRegionId) {
      return next(ApiError.badRequest("Региона с таким id не существует"));
    }
    try {
      await RegionService.delete(country, id);
      return res.json({ ...checkRegionId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new RegionsController();
