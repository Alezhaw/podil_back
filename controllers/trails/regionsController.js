const ApiError = require("../../error/ApiError");
const RegionService = require("../../services/trails/regionService");
const { Op } = require("sequelize");

class RegionsController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await RegionService.getAll(country));
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
    if (!region.region || !country || !Number.isInteger(region.timezone)) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkRegion = await RegionService.getByName(country, region.region);
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
    const { region, country } = req.body;

    if (!region || !country || !region.id || !Number.isInteger(region.timezone)) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkRegionName = await RegionService.getByWhere(country, { region: region.region, timezone: region.timezone });
    if (checkRegionName[0]) {
      return next(ApiError.badRequest("Регион с таким именем уже существует"));
    }
    const checkRegionId = await RegionService.getById(country, region.id);
    if (!checkRegionId) {
      return next(ApiError.badRequest("Региона с таким id не существует"));
    }
    try {
      const updatedRegions = await RegionService.update(country, region);
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

  async remove(req, res, next) {
    const { region, country } = req.body;
    if (!country || !region.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await RegionService.getById(country, region.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedRegion = await RegionService.remove(country, !!region.relevance_status, region.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new RegionsController();
