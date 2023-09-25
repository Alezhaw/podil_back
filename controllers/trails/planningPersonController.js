const ApiError = require("../../error/ApiError");
const PlanningPersonService = require("../../services/trails/planningPersonService");

class PlanningPersonController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await PlanningPersonService.getAll(country));
  }

  async create(req, res, next) {
    const { planningPerson, country } = req.body;
    if (!planningPerson || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkPlanningPerson = await PlanningPersonService.getByName(country, planningPerson);
    if (checkPlanningPerson) {
      return next(ApiError.badRequest("PlanningPerson с таким именем уже существует"));
    }
    try {
      const newPlanningPerson = await PlanningPersonService.create(country, planningPerson);
      return res.json(newPlanningPerson);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { planningPerson, country, id } = req.body;

    if (!planningPerson || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkPlanningPersonName = await PlanningPersonService.getByName(country, planningPerson);
    if (checkPlanningPersonName) {
      return next(ApiError.badRequest("PlanningPerson с таким именем уже существует"));
    }
    const checkPlanningPersonId = await PlanningPersonService.getById(country, id);
    if (!checkPlanningPersonId) {
      return next(ApiError.badRequest("PlanningPerson с таким id не существует"));
    }
    try {
      const updatedPlanningPerson = await PlanningPersonService.update(country, planningPerson, id);
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

  async remove(req, res) {
    const { id, country, relevance_status } = req.body;
    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await CallTemplateService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCallTemplate = await CallTemplateService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new PlanningPersonController();
