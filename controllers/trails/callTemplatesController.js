const ApiError = require("../../error/ApiError");
const CallTemplateService = require("../../services/trails/callTemplatesService");

class CallTemplatesController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CallTemplateService.getAll(country));
  }

  async create(req, res, next) {
    const { callTemplate, country } = req.body;
    if (!callTemplate || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkCallTemplate = await CallTemplateService.getByName(country, callTemplate);
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
    const { callTemplate, country, id } = req.body;

    if (!callTemplate || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkCallTemplateName = await CallTemplateService.getByName(country, callTemplate);
    if (checkCallTemplateName) {
      return next(ApiError.badRequest("Шаблон вызова с таким именем уже существует"));
    }
    const checkCallTemplateId = await CallTemplateService.getById(country, id);
    if (!checkCallTemplateId) {
      return next(ApiError.badRequest("Шаблон вызова с таким id не существует"));
    }
    try {
      const updatedCallTemplate = await CallTemplateService.update(country, callTemplate, id);
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
}

module.exports = new CallTemplatesController();
