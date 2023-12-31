const ApiError = require("../../error/ApiError");
const PlanningPersonService = require("../../services/trails/planningPersonService");
const { Op } = require("sequelize");

class PlanningPersonController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await PlanningPersonService.getAll(country));
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

    const cities = await PlanningPersonService.getByWhere(country, where);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    const { planningPeople, country } = req.body;
    if (!planningPeople.name || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkPlanningPerson = await PlanningPersonService.getByName(country, planningPeople.name);
    if (checkPlanningPerson) {
      return next(ApiError.badRequest("PlanningPerson с таким именем уже существует"));
    }
    try {
      const newPlanningPerson = await PlanningPersonService.create(country, planningPeople);
      return res.json(newPlanningPerson);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { planningPeople, country } = req.body;

    if (!planningPeople || !country || !planningPeople.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkPlanningPersonName = await PlanningPersonService.getByName(country, planningPeople.name);
    if (checkPlanningPersonName) {
      return next(ApiError.badRequest("PlanningPerson с таким именем уже существует"));
    }
    const checkPlanningPersonId = await PlanningPersonService.getById(country, planningPeople.id);
    if (!checkPlanningPersonId) {
      return next(ApiError.badRequest("PlanningPerson с таким id не существует"));
    }
    try {
      const updatedPlanningPerson = await PlanningPersonService.update(country, planningPeople);
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

    const checkPlanningPersonId = await PlanningPersonService.getById(country, id);
    if (!checkPlanningPersonId) {
      return next(ApiError.badRequest("PlanningPerson с таким id не существует"));
    }
    try {
      await PlanningPersonService.delete(country, id);
      return res.json({ ...checkPlanningPersonId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { planningPeople, country } = req.body;
    if (!country || !planningPeople.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await PlanningPersonService.getById(country, planningPeople.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedPlanningPerson = await PlanningPersonService.remove(country, !!planningPeople.relevance_status, planningPeople.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new PlanningPersonController();
