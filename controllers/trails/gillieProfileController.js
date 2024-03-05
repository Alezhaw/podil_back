const ApiError = require("../../error/ApiError");
const GillieProfileService = require("../../services/trails/gillieProfileService");
const { Op } = require("sequelize");

class GillieProfileController {
  async getAll(req, res) {
    return res.json(await GillieProfileService.getAll());
  }

  async getByIds(req, res, next) {
    const { ids } = req.body;
    if (!ids[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    ids.map((id) => actions.push({ id }));

    let where = {
      [Op.or]: actions,
    };

    const profiles = await GillieProfileService.getByWhere(where);

    if (!profiles) {
      return next(ApiError.internal("Profiles not found"));
    }
    return res.json({ profiles });
  }

  async create(req, res, next) {
    const { profile } = req.body;
    if (!profile) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkProfile = await GillieProfileService.getById(profile?.id);
    if (checkProfile) {
      return next(ApiError.badRequest("Такой профиль уже есть"));
    }
    try {
      const newProfile = await GillieProfileService.create(profile);
      return res.json(newProfile);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { profile } = req.body;

    if (!profile || !profile.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkProfile = await GillieProfileService.getById(profile?.id);
    if (checkProfile) {
      return next(ApiError.badRequest("Профиль не найден"));
    }

    try {
      const updatedProfile = await GillieProfileService.update(profile);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async delete(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkProfile = await GillieProfileService.getById(id);
    if (!checkProfile) {
      return next(ApiError.badRequest("Профиль с таким id не существует"));
    }
    try {
      await GillieProfileService.delete(id);
      return res.json({ ...checkProfile.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { profile } = req.body;
    if (!profile.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await GillieProfileService.getById(profile.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedProfile = await GillieProfileService.remove(!!profile.relevance_status, profile.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new GillieProfileController();
