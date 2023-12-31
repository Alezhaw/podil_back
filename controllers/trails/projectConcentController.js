const ApiError = require("../../error/ApiError");
const ProjectConcentService = require("../../services/trails/projectConcentService");
const { Op } = require("sequelize");

class ProjectConcentController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await ProjectConcentService.getAll(country));
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

    const cities = await ProjectConcentService.getByWhere(country, where);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    const { projectConcent, country } = req.body;
    if (!projectConcent.name || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkProjectConcent = await ProjectConcentService.getByName(country, projectConcent.name);
    if (checkProjectConcent) {
      return next(ApiError.badRequest("ProjectConcent с таким именем уже существует"));
    }
    try {
      const newProjectConcent = await ProjectConcentService.create(country, projectConcent);
      return res.json(newProjectConcent);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { projectConcent, country } = req.body;

    if (!projectConcent || !country || !projectConcent.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkProjectConcentName = await ProjectConcentService.getByName(country, projectConcent.name);
    if (checkProjectConcentName) {
      return next(ApiError.badRequest("ProjectConcent с таким именем уже существует"));
    }
    const checkProjectConcentId = await ProjectConcentService.getById(country, projectConcent.id);
    if (!checkProjectConcentId) {
      return next(ApiError.badRequest("ProjectConcent с таким id не существует"));
    }
    try {
      const updatedProjectConcent = await ProjectConcentService.update(country, projectConcent);
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

    const checkProjectConcentId = await ProjectConcentService.getById(country, id);
    if (!checkProjectConcentId) {
      return next(ApiError.badRequest("ProjectConcent с таким id не существует"));
    }
    try {
      await ProjectConcentService.delete(country, id);
      return res.json({ ...checkProjectConcentId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { projectConcent, country } = req.body;
    if (!country || !projectConcent.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await ProjectConcentService.getById(country, projectConcent.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedProjectConcent = await ProjectConcentService.remove(country, !!projectConcent.relevance_status, projectConcent.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new ProjectConcentController();
