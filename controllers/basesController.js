const ApiError = require("../error/ApiError");
const BaseService = require("../services/baseService");

class BasesController {
  async create(req, res, next) {
    const { data, country } = req.body;
    let user = req.user;

    const result = BaseService.CreateOrUpdate({ data, user, country });

    return res.json({
      result,
    });
  }

  async getAll(req, res) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await BaseService.GetAll(country));
  }

  async getOneBase(req, res, next) {
    const { id, base_id, country } = req.body;

    if (!id && !base_id) {
      return next(ApiError.badRequest("Укажите id или base_id"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    const base = id ? await BaseService.getById(id, country) : await BaseService.getByBaseId(base_id, country);
    if (!base) {
      return next(ApiError.internal("База не найдена"));
    }
    return res.json(base);
  }

  async getBasesForCity(req, res, next) {
    const { id_for_base, country } = req.body;

    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    const bases = await BaseService.getByIdForBase(id_for_base, country);
    if (!bases) {
      return next(ApiError.internal("Базы не найдены"));
    }
    return res.json(bases);
  }

  async getFilteredBases(req, res, next) {
    const { search, country } = req.body;

    if (!search) {
      return next(ApiError.badRequest("Укажите запрос"));
    }

    const bases = BaseService.getFilteredBases({ search, country });

    return res.json(bases);
  }

  async deleteBase(req, res, next) {
    const { id, base_id, country } = req.body;
    let user = req.user;
    if (!id && !base_id) {
      return next(ApiError.badRequest("Укажите id или base_id"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    const result = BaseService.DeleteBase({ id, base_id, user, country });
    return res.json(result);
  }
}

module.exports = new BasesController();
