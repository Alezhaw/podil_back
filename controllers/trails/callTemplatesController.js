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
<<<<<<< Updated upstream
=======
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(ApiError.badRequest("Шаблон вызова с таким именем уже существует"));
      }
>>>>>>> Stashed changes
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

module.exports = new CallTemplatesController();
