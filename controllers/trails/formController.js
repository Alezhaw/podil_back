const ApiError = require("../../error/ApiError");
const FormService = require("../../services/trails/formService");
const CitiesWithRegService = require("../../services/trails/citiesWithRegionsService");
const { Op } = require("sequelize");

class FormController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await FormService.getAll(country));
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

    const forms = await FormService.getByWhere(country, where);

    if (!forms) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ forms });
  }

  async getByName(req, res, next) {
    const { country, search, city_id } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    if (search) {
      actions.push({ local: { [Op.iLike]: `%${search}%` } });
    }
    let where = {};
    if (!!actions[0]) {
      where = {
        [Op.or]: actions,
      };
    }
    if (city_id) {
      where.city_id = city_id;
    }
    where.relevance_status = true;

    const forms = await FormService.getByWhereWithLimit(country, where, 50);

    if (!forms) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json(forms);
  }

  async create(req, res, next) {
    const { country, form } = req.body;

    if (!country || !form || !form.city_id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    if (!!form.id) {
      const checkFormId = await FormService.getById(country, form.id);
      if (checkFormId) {
        return next(ApiError.badRequest("Такой зал уже есть"));
      }
    }

    const checkCityId = await CitiesWithRegService.getById(country, form.city_id);
    if (!checkCityId) {
      return next(ApiError.badRequest("Такого города нет"));
    }

    let where = {
      local: form.local,
    };

    const checkForm = await FormService.getByWhere(country, where);
    if (checkForm[0]) {
      return next(ApiError.badRequest("Такой зал уже есть"));
    }
    try {
      const newForm = await FormService.create({ country, form });
      return res.json(newForm);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { country, form } = req.body;

    if (!country || !form.id || !form.city_id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkFormId = await FormService.getById(country, form.id);
    if (!checkFormId) {
      return next(ApiError.badRequest("Такого зала нет"));
    }

    const checkCityId = await CitiesWithRegService.getById(country, form.city_id);

    if (!checkCityId) {
      return next(ApiError.badRequest("Такого города нет"));
    }
    try {
      const updatedForm = await FormService.update({ country, form });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  //   async delete(req, res, next) {
  //     const { country, id } = req.body;

  //     if (!country || !id) {
  //       return next(ApiError.badRequest("Укажите все данные"));
  //     }

  //     const checkCityId = await CitiesWithRegService.getById(country, id);
  //     if (!checkCityId) {
  //       return next(ApiError.badRequest("Города с таким id не существует"));
  //     }
  //     try {
  //       await CitiesWithRegService.delete(country, id);
  //       return res.json({ ...checkCityId.dataValues });
  //     } catch (e) {
  //       return next(ApiError.badRequest("Непредвиденная ошибка"));
  //     }
  //   }

  async remove(req, res) {
    const { id, country, relevance_status } = req.body;
    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await FormService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCallTemplate = await FormService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new FormController();
