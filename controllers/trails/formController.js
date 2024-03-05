const ApiError = require("../../error/ApiError");
const FormService = require("../../services/trails/formService");
const CitiesWithRegService = require("../../services/trails/citiesWithRegionsService");
const RegionService = require("../../services/trails/regionService");
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
    if (city_id) {
      const citiesForForms = await CitiesWithRegService.getByWhere(country, { id: city_id });
      citiesForForms.map((el) => {
        actions.push({ city_id, region_id: el.dataValues.region_id });
      });
    }

    let where = {};
    if (!!actions[0]) {
      where = {
        [Op.or]: actions,
      };
    }

    console.log(1, actions, where);

    where.relevance_status = true;

    const forms = await FormService.getByWhereWithLimit(country, where, 50);

    if (!forms) {
      return next(ApiError.internal("Города не найдены"));
    }

    let ids = [];

    forms.map((el) => ids.push({ id: el.dataValues.city_id }));

    const whereForCities = {
      relevance_status: true,
      [Op.or]: ids,
    };

    const cities = await CitiesWithRegService.getByWhere(country, whereForCities);

    return res.json({ forms, cities });
  }

  async create(req, res, next) {
    let { form } = req.body;
    const country = form?.country;
    form = form?.form;

    if (!country || !form || !form.city_id || !form.region_id || !form.local || !form.address) {
      return next(ApiError.badRequest("Укажите все данные: city, region, institution, address"));
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

    const checkRegionId = await RegionService.getById(country, form.region_id);
    if (!checkRegionId) {
      return next(ApiError.badRequest("Такого региона нет"));
    }

    let where = {
      city_id: form.city_id,
      local: form.local,
      relevance_status: true,
    };

    const checkForm = await FormService.getByWhere(country, where);
    if (checkForm[0]) {
      return next(ApiError.badRequest("Такой зал уже есть"));
    }
    try {
      const newForm = await FormService.create({ country, form });
      return res.json(newForm);
    } catch (e) {
      console.log("create form error", e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    let { country, form } = req.body;
    if (!country || !form.id || !form.city_id || !form.region_id || !form.local || !form.address) {
      return next(ApiError.badRequest("Укажите все данные: city, region, local, address"));
    }

    const checkFormId = await FormService.getById(country, form.id);
    if (!checkFormId) {
      return next(ApiError.badRequest("Такого зала нет"));
    }

    const checkCityId = await CitiesWithRegService.getById(country, form.city_id);

    if (!checkCityId) {
      return next(ApiError.badRequest("Такого города нет"));
    }

    const checkRegionId = await RegionService.getById(country, form.region_id);
    if (!checkRegionId) {
      return next(ApiError.badRequest("Такого региона нет"));
    }

    try {
      const updatedForm = await FormService.update({ country, form });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
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
