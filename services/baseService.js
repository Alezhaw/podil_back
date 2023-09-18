const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Cities, KzCities, PlCities } = require("../models/citiesModels");
const { Bases, KzBases, PlBases } = require("../models/basesModels");
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
    PL: {
      cities: PlCities,
      bases: PlBases,
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
        const checkUnique = item.id ? await this.getById(item.id, country) : await this.getByBaseId(item.podzial_id, country);
        if (checkUnique) {
          try {
            const result = await ObjectHelper.sendDifferencesToDatabase(checkUnique, item, country, "update", user, "base");
            console.log(1, result);
            if (!result) {
              error.push({
                podzial_id: item.podzial_id,
                error: "Failed to write log",
              });
            }
            if (result === "Нет отличий") {
              return;
            }
            await this.updateBase(item, checkUnique, country);
            basesForWebSocket.push(item);
            update = `${update}/${item.podzial_id}`;
            return;
          } catch (e) {
            return error.push({
              podzial_id: item.podzial_id,
              error: e.message,
            });
          }
        }
        if (!item.id_for_base) {
          notIdForBase = `${notIdForBase}/${item.podzial_id}`;
          return;
        }
        try {
          const base = await this.createBase(item, country);
          bases.push(base.dataValues);
          basesForWebSocket.push(base.dataValues);
          const result = await ObjectHelper.sendDifferencesToDatabase(base, item, country, "create", user, "base");
          if (!result) {
            error.push({
              podzial_id: item.podzial_id,
              error: "Failed to write log",
            });
          }
        } catch (e) {
          return error.push({
            podzial_id: item.podzial_id,
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
    const city = await this.getDistinctFilteredCitiesIdForBase(country, search);
    if (!city) {
      throw ApiError.internal("Города не найдены");
    }

    let bases = await this.getByManyIdForBase(country, city);
    bases = bases[0] ? bases : await this.getBySearch(country, search);
    bases = bases?.map((base) => ({ ...(base.dataValues || base), city_lokal: city?.filter((oneCity) => Number(oneCity.id_for_base) === Number(base.id_for_base))[0]?.city_lokal }));
    return bases;
  }

  async DeleteBase({ id, podzial_id, user, country }) {
    const base = id ? await this.getById(id, country) : await this.getByBaseId(podzial_id, country);
    if (!base) {
      throw ApiError.internal("База не найдена");
    }
    const result = await ObjectHelper.sendDifferencesToDatabase(base, base.dataValues, country, "delete", user, "base");
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

  async getDistinctFilteredCitiesIdForBase(country, search) {
    let where = {};
    if (search) {
      where.city_lokal = {
        [Op.iLike]: `%${search}%`,
      };
    }
    return await this.models[country].cities.findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("id_for_base")), "id_for_base"], "city_lokal"],
    });
  }

  async getById(id, country) {
    return await this.models[country].bases.findOne({ where: { id } });
  }

  async getByBaseId(podzial_id, country) {
    return await this.models[country].bases.findOne({ where: { podzial_id } });
  }

  async getByIdForBase(id_for_base, country) {
    return await this.models[country].bases.findAll({ where: { id_for_base } });
  }

  async getByManyIdForBase(country, cityWithIdForBase) {
    let options = [];
    cityWithIdForBase.map((el) => {
      el = el.dataValues;
      options.push({
        id_for_base: el.id_for_base,
      });
    });
    let where = {
      [Op.or]: options,
    };
    return await this.models[country].bases.findAll({ where });
  }

  async getBySearch(country, search) {
    let where = {};
    if (search) {
      where.podzial_id = {
        [Op.iLike]: `%${search}%`,
      };
    }
    return await this.models[country].bases.findAll({ where });
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
