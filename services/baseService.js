const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Cities, Bases, KzCities, KzBases } = require("../models/models");
const { Sequelize, Op } = require("sequelize");

class BaseService {
  models = {
    RU: {
      cities: Cities,
      bases: Bases,
    },
    KZ: {
      cities: KzCities,
      bases: KzBases,
    },
  };

  async DeleteBase({ id, base_id, user, country }) {
    const base = id ? await this.getById(id, country) : await this.getByBaseId(base_id, country);
    if (!base) {
      throw ApiError.internal("База не найдена");
    }
    const result = ObjectHelper.sendDifferencesToDatabase(base, base.dataValues, country, "delete", user, "base");
    if (!result) {
      throw ApiError.internal("Failed to write log");
    }

    try {
      await this.DeleteById(base.id, country);
      global.io.to("1").emit("deleteBaseRu", {
        data: { deleteBase: base.id, country: country },
      });
    } catch (e) {
      throw ApiError.internal("Delete failed");
    }

    return { ...base.dataValues };
  }

  async getAll(country) {
    return await this.models[country].bases.findAll();
  }

  async getById(id, country) {
    return await this.models[country].bases.findOne({ where: { id } });
  }

  async getByBaseId(base_id, country) {
    return await this.models[country].bases.findOne({ where: { base_id } });
  }

  async getByIdForBase(id_for_base, country) {
    return await this.models[country].bases.findAll({ where: { id_for_base } });
  }

  async DeleteById(id, country) {
    return await this.models[country].bases.destroy({ where: { id } });
  }
}

module.exports = new BaseService();
