const ApiError = require("../error/ApiError");
const CityService = require("../services/cityService");
const CityHelper = require("../utils/cityHelper");

class CitiesController {
  async create(req, res, next) {
    let user = req.user;
    const { data, country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    let result = await CityService.UpdateOrCreate(data, user, country);
    return res.json(result);
  }

  async createByTrails(req, res, next) {
    let user = req.user;
    const { country, data, status } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    console.log(1, status);
    let result = await CityService.UpdateOrCreateByTrails({ country, data, user, status });

    return res.json(result);
  }

  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CityService.GetAll(country));
  }

  async getMaxIdForBase(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    return res.json(await CityService.getMaxIdForBase(country));
  }

  async fixDate(req, res) {
    // await CityService.fixDate();
    return res.json(123);
  }

  async getFilteredCities(req, res, next) {
    const { search, filter, sort, pageSize, page, country } = req.body;
    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }

    const result = await CityService.GetFiltered({
      search,
      filter,
      sort,
      pageSize,
      page,
      country,
    });

    return res.json({ ...result });
  }

  async getOneCity(req, res, next) {
    const { id, id_for_base, country } = req.body;

    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    let city = id ? await CityService.GetTimeById(id, country) : await CityService.GetTimes(id_for_base, country);
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    if (!!city[0]) {
      city = CityHelper.changeCitiesTime(city);
    }
    return res.json(city);
  }

  async changeCheck(req, res, next) {
    const { id, id_for_base, check_base, check_speaker, check_scenario, country } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    if (typeof (check_base ?? check_speaker ?? check_scenario) !== "boolean") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    try {
      let result = await CityService.ChangeCheck(id, id_for_base, check_base, check_speaker, check_scenario, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async changeStatus(req, res, next) {
    const { id, id_for_base, status, country } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (typeof status !== "number") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    try {
      let result = await CityService.ChangeStatus(id, id_for_base, status, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteCity(req, res, next) {
    const { id_for_base, country } = req.body;
    let user = req.user;
    console.log(123);
    if (!id_for_base) {
      console.log(124);
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    console.log(125);
    if (!country) {
      console.log(126);
      return next(ApiError.badRequest("Укажите country"));
    }
    console.log(127);
    try {
      console.log(128);
      let result = await CityService.DeleteCity(id_for_base, user, country);
      console.log(129);
      console.log(130, result);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteTime(req, res, next) {
    const { id, country } = req.body;
    let user = req.user;

    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }

    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    try {
      let result = await CityService.DeleteTime(id, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async test(req, res, next) {
    const { inProgress, canceled, zamkniete, search, country } = req.body;
    try {
      let result = await CityService.GetFiltered(inProgress, canceled, zamkniete, "test", country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CitiesController();
