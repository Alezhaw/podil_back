const ApiError = require("../../error/ApiError");
const CallTemplateService = require("../../services/trails/callTemplatesService");
const { Op } = require("sequelize");

class CallTemplatesController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CallTemplateService.getAll(country));
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

    const cities = await CallTemplateService.getByWhere(country, where);

    if (!cities) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ cities });
  }

  async create(req, res, next) {
    const { callTemplate, country } = req.body;
    if (!callTemplate.name || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkCallTemplate = await CallTemplateService.getByName(country, callTemplate.name);
    if (checkCallTemplate) {
      return next(ApiError.badRequest("Шаблон вызова с таким именем уже существует"));
    }
    try {
      const newCallTemplate = await CallTemplateService.create(country, callTemplate);
      return res.json(newCallTemplate);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { callTemplate, country } = req.body;

    if (!callTemplate || !country || !callTemplate.id || !callTemplate.name) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    // const checkCallTemplateName = await CallTemplateService.getByName(country, callTemplate.name);
    // if (checkCallTemplateName) {
    //   return next(ApiError.badRequest("Шаблон вызова с таким именем уже существует"));
    // }
    const checkCallTemplateId = await CallTemplateService.getById(country, callTemplate.id);
    if (!checkCallTemplateId) {
      return next(ApiError.badRequest("Шаблон вызова с таким id не существует"));
    }
    try {
      const updatedCallTemplate = await CallTemplateService.update(country, callTemplate);
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

    const checkCallTemplateId = await CallTemplateService.getById(country, id);
    if (!checkCallTemplateId) {
      return next(ApiError.badRequest("Шаблон вызова с таким id не существует"));
    }
    try {
      await CallTemplateService.delete(country, id);
      return res.json({ ...checkCallTemplateId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { callTemplate, country } = req.body;
    if (!country || !callTemplate.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await CallTemplateService.getById(country, callTemplate.id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCallTemplate = await CallTemplateService.remove(country, !!callTemplate.relevance_status, callTemplate.id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new CallTemplatesController();
