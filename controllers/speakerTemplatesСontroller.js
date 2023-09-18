const ApiError = require("../error/ApiError");
const { SpeakerTemplate } = require("../models/models");
const sequelize = require("../db");

class SpeakerTemplateController {
  async getAllTemplates(req, res) {
    const templates = await SpeakerTemplate.findAll();
    return res.json(templates);
  }

  async create(req, res, next) {
    const { name, type, text } = req.body;

    if (!name || !type || !text) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    if (type < 1) {
      return next(ApiError.badRequest("Неверный тип"));
    }

    const checkTemplate = await SpeakerTemplate.findOne({ where: { name } });
    if (checkTemplate) {
      return next(ApiError.badRequest("Шаблон с таким именем уже существует"));
    }
    try {
      const template = await SpeakerTemplate.create({ name, type, text });
      return res.json(template);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { name, type, text, id } = req.body;

    if (!name || !type || !text || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkTemplateName = await SpeakerTemplate.findOne({ where: { name } });
    if (checkTemplateName) {
      return next(ApiError.badRequest("Шаблон с таким именем уже существует"));
    }
    const checkTemplateId = await SpeakerTemplate.findOne({ where: { id } });
    if (!checkTemplateId) {
      return next(ApiError.badRequest("Шаблона с таким id не существует"));
    }
    try {
      const template = await SpeakerTemplate.update({ name, type, text }, { where: { id } });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async delete(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }

    const checkTemplateId = await SpeakerTemplate.findOne({ where: { id } });
    if (!checkTemplateId) {
      return next(ApiError.badRequest("Шаблона с таким id не существует"));
    }
    try {
      await SpeakerTemplate.destroy({
        where: { id },
      });
      return res.json({ ...checkTemplateId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getByType(req, res, next) {
    const { type, country } = req.body;

    if (!type || !country) {
      return next(ApiError.badRequest("Укажите type и country"));
    }

    const templates = await SpeakerTemplate.findAll({ where: { type, country } });
    if (!templates) {
      return next(ApiError.badRequest("Шаблоны не найдены"));
    }
    return res.json(templates);
  }

  async getTypes(req, res) {
    try {
      let types = await sequelize.query('SELECT DISTINCT "type" FROM "speaker_templates"');
      types = types[0].map((el) => el.type).sort((a, b) => a - b);
      return res.json(types);
    } catch (e) {
      console.log("speakerTemplates something get wrong");
    }
  }
}

module.exports = new SpeakerTemplateController();
