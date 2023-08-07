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

  async CreateOrUpdate({ data, user, country }) {
    let update = "";
    let notIdForBase = "";
    let error = [];
    let bases = [];
    let basesForWebSocket = [];
    await Promise.all(
      data.map(async (item, index) => {
        const checkUnique = item.id ? await this.getById(item.id, country) : await this.getByBaseId(item.base_id, country);
        if (checkUnique) {
          try {
            const result = ObjectHelper.sendDifferencesToDatabase(checkUnique, item, country, "update", user, "base");
            if (!result) {
              error.push({
                base_id: item.base_id,
                error: "Failed to write log",
              });
            }
            await this.updateBase(item, checkUnique, country);
            basesForWebSocket.push(item);
            update = `${update}/${item.base_id}`;
            return;
          } catch (e) {
            return error.push({
              base_id: item.base_id,
              error: e.message,
            });
          }
        }
        if (!item.id_for_base) {
          notIdForBase = `${notIdForBase}/${item.base_id}`;
          return;
        }
        try {
          const base = await this.createBase(item, country);
          bases.push(base.dataValues);
          basesForWebSocket.push(base.dataValues);
          const result = ObjectHelper.sendDifferencesToDatabase(base, item, country, "create", user, "base");
          if (!result) {
            error.push({
              base_id: item.base_id,
              error: "Failed to write log",
            });
          }
        } catch (e) {
          return error.push({
            base_id: item.base_id,
            error: e.message,
          });
        }
      })
    );

    if (basesForWebSocket[0]) {
      global.io.to("1").emit("updateBasesRu", {
        data: { bases: basesForWebSocket, country: country },
      });
    }

    return {
      update,
      notIdForBase,
      bases,
      error,
    };
  }

  async getFilteredBases({ search, country }) {
    const city = await this.getAllCities(country);
    if (!city) {
      throw ApiError.internal("Нет городов в базе данных");
    }

    const filteredCities = city
      ?.filter((el) => (search ? el?.miasto_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.id_for_base).indexOf(item.id_for_base) === i;
      })
      ?.map((el) => el.id_for_base);
    const allBases = await this.getAll(country);
    let bases = filteredCities?.map((cityBaseId) => allBases.filter((base) => base.id_for_base === cityBaseId))?.flat();
    bases = bases[0] ? bases : allBases.filter((base) => String(base.base_id).toLowerCase().includes(String(search).toLowerCase()));
    bases = bases?.map((base) => ({ ...(base.dataValues || base), miasto_lokal: city?.filter((oneCity) => Number(oneCity.id_for_base) === Number(base.id_for_base))[0]?.miasto_lokal }));
    return bases;
  }

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
      await this.deleteById(base.id, country);
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

  async getAllCities(country) {
    return await this.models[country].cities.findAll();
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

  async updateBase(item, checkUnique, country) {
    await this.models[country].bases.update(
      {
        ...item,
      },
      { where: { id: checkUnique.id } }
    );
  }

  async createBase(item, country) {
    return await this.models[country].bases.create(item);
  }

  async deleteById(id, country) {
    return await this.models[country].bases.destroy({ where: { id } });
  }
}

module.exports = new BaseService();
