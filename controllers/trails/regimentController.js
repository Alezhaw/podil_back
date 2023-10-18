const ApiError = require("../../error/ApiError");
const RegimentService = require("../../services/trails/regimentService");
const { Op } = require("sequelize");

class RegimentController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await RegimentService.getAll(country));
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

    const cities = await RegimentService.getByWhere(country, where);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    const { regiment, country } = req.body;
    if (!regiment || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkRegiment = await RegimentService.getByName(country, regiment.name);
    if (checkRegiment) {
      return next(ApiError.badRequest("Regiment с таким именем уже существует"));
    }
    try {
      const newRegiment = await RegimentService.create(country, regiment);
      return res.json(newRegiment);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { regiment, country } = req.body;

    if (!regiment.name || !country || !regiment.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkRegimentName = await RegimentService.getByName(country, regiment.name);
    if (checkRegimentName) {
      return next(ApiError.badRequest("Regiment с таким именем уже существует"));
    }
    const checkRegimentId = await RegimentService.getById(country, regiment.id);
    if (!checkRegimentId) {
      return next(ApiError.badRequest("Regiment с таким id не существует"));
    }
    try {
      const updatedRegiment = await RegimentService.update(country, regiment);
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

    const checkRegimentId = await RegimentService.getById(country, id);
    if (!checkRegimentId) {
      return next(ApiError.badRequest("Regiment с таким id не существует"));
    }
    try {
      await RegimentService.delete(country, id);
      return res.json({ ...checkRegimentId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { regiment, country } = req.body;
    if (!country || !regiment.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await RegimentService.getById(country, regiment.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedRegiment = await RegimentService.remove(country, !!regiment.relevance_status, regiment.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new RegimentController();
