const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Cities, KzCities, PlCities } = require("../models/citiesModels");
const { Bases, KzBases, PlBases } = require("../models/basesModels");
const { Trails, KzTrails, PlTrails, CitiesWithReg, KzCitiesWithReg, PlCitiesWithReg } = require("../models/trails/trailsModels");
const { Sequelize, Op } = require("sequelize");
const CityService = require("./CityService");
const Blazor = require("../api/blazor.js");

class BaseService {
  models = {
    RU: {
      cities: Cities,
      bases: Bases,
      trails: Trails,
      citiesWithReg: CitiesWithReg,
    },
    KZ: {
      cities: KzCities,
      bases: KzBases,
      trails: KzTrails,
      citiesWithReg: KzCitiesWithReg,
    },
    PL: {
      cities: PlCities,
      bases: PlBases,
      trails: PlTrails,
      citiesWithReg: PlCitiesWithReg,
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
          console.log("createBase", item);
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
      global.io.to("1").emit("updateBases", {
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

  async CreateByTrail({ base, user, country, trailId }) {
    let error = [];
    let bases = [];
    let basesForWebSocket = [];
    if (!user) {
      user = { id: 1, email: "sasha@gmail.com" };
    }

    const time = await CityService.GetTimeByTrailIdAndScheme(trailId, null, country);
    if (time) {
      try {
        base = { ...base, id_for_base: time?.dataValues?.id_for_base };
        let result = await this.createBase(base, country);
        bases.push(result.dataValues);
        basesForWebSocket.push(result.dataValues);
        const resultLogs = await ObjectHelper.sendDifferencesToDatabase(result, base, country, "create", user, "base");
        if (!resultLogs) {
          error.push({
            podzial_id: item.podzial_id,
            error: "Failed to write log",
          });
        }
      } catch (e) {
        console.log("createBaseByTrail error:", e);
        error.push({
          error: e,
          trailId: trailId,
          base: base,
        });
      }
    } else {
      ({
        error: "City not found",
        trailId: trailId,
        base: base,
      });
    }

    if (basesForWebSocket[0]) {
      global.io.to("1").emit("updateBases", {
        data: { bases: basesForWebSocket, country: country },
      });
    }

    return {
      bases,
      error,
    };
  }

  async updateByTime({ country, startDate, endDate }) {
    if (!startDate) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate = startDate.toISOString().split("T")[0];
      startDate = new Date(startDate);
    }
    if (!endDate) {
      endDate = new Date();
      endDate = endDate.toISOString().split("T")[0];
      endDate = new Date(endDate);
    }
    const servers = await Blazor.getServers();
    let instances = await Blazor.getInstance();
    if (!instances || !servers) {
      return console.log("updateByTime error: no servers or no instances");
    }
    instances = instances?.map((el) => ({ ...el, server: servers?.find((item) => item?.url === el?.ApiAddress) }))?.filter((el) => !!el?.server);
    let instancesBithBases = await Promise.all(instances?.slice(0, 10)?.map(async (el) => ({ ...el, ids: await Blazor.getCampaignIdsByDate(el?.server, startDate, endDate) })));
    instancesBithBases = instancesBithBases?.filter((el) => el?.ids && el?.ids[0]);
    const baseWithServers = instancesBithBases?.map((el) => el?.ids?.map((item) => ({ gazooCampaignId: item, gazooServerId: el?.server?.id })))?.flat();
    let bases = await this.getByWhere(country, { [Op.or]: baseWithServers });
    bases = bases?.map((el) => el.dataValues);
    await this.updateByGazooForBases({ country, bases });
  }

  async updateByGazoo({ country, id_for_bases }) {
    let bases = await this.models[country].bases.findAll({ where: { id_for_base: { [Op.or]: id_for_bases } } });
    bases = bases?.map((el) => el.dataValues);
    return await this.updateByGazooForBases({ country, bases });
  }

  async updateByGazooForBases({ country, bases }) {
    const user = { id: 1, email: "sasha@gmail.com" };
    const servers = await Blazor.getServers();

    bases = bases?.map((el) => ({ ...el, server: servers?.find((item) => item.id === el.gazooServerId) }));
    bases = await Promise.all(bases.map(async (el) => ({ ...el, result: await Blazor.campaignResults(el.server, el.gazooCampaignId) })));
    bases = bases?.map((el) => ({ ...el, result: { records: el?.result?.botAgentBusinessResults, answer: el?.result?.botAgentBusinessResults?.reduce((acc, el) => el?.count + acc, 0) } }));
    bases = bases?.map((base) => {
      const regex = /(\d{1,2})[: ](\d{2})?|\d{1,2}/g;
      const inputArray = base?.result?.records || [];
      let resultArray = [];
      inputArray.forEach((item) => {
        const result = [];
        let m;
        const str = item.name;
        while ((m = regex.exec(str)) !== null) {
          const hours = m[1] !== undefined ? m[1] : m[0];
          const paddedHours = hours.length === 1 ? `0${hours}` : hours;
          result.push(paddedHours);
        }
        resultArray.push({ count: item.count, result });
      });

      resultArray = resultArray
        ?.filter((el) => {
          let result = el?.result[0];
          if (result) {
            result = Number(result);
            if (result > 6 && result < 21) return true;
          }
        })
        ?.map((el) => ({ count: el?.count, hour: Number(el?.result[0]) }));
      return { ...base, result: { answer: base?.result?.answer, records: resultArray } };
    });
    bases = await Promise.all(
      bases?.map(async (base) => {
        let firstTime = 0;
        let secondTime = 0;
        let thirdTime = 0;
        base?.result?.records?.map((el) => {
          switch (true) {
            case el.hour < 12:
              firstTime += el.count;
              break;
            case el.hour < 16:
              secondTime += el.count;
              break;
            default:
              thirdTime += el.count;
          }
        });
        const newBase = { ...base, sogl_1: firstTime || null, sogl_2: secondTime || null, sogl_3: thirdTime || null, stat_1: base?.result?.answer || null };
        const result = await ObjectHelper.sendDifferencesToDatabase({ dataValues: base }, newBase, country, "update", user, "base");
        return newBase;
      })
    );
    bases = bases?.map((base) => {
      delete base?.result;
      delete base?.server;
      return base;
    });
    const updatedBases = await Promise.all(
      bases?.map(async (base) => {
        try {
          await this.updateBase(base, base, country);
        } catch (e) {
          console.log("UpdateBase error:", e);
          return { error: e };
        }
      })
    );
    const baseForTest = bases[10];
    if (bases[0]) {
      global.io.to("1").emit("updateBases", {
        data: { bases: bases, country: country },
      });
    }
    console.log("updateByGazoo", bases);
    return bases;
  }

  async getFilteredBases({ search, country }) {
    const city = await this.getDistinctFilteredCitiesIdForBase(country, search);
    if (!city) {
      throw ApiError.internal("Города не найдены");
    }

    let bases = await this.getByManyIdForBase(country, city);
    bases = bases[0] ? bases : await this.getBySearch(country, search);
    bases = bases?.map((base) => {
      const currentCity = city?.find((oneCity) => Number(oneCity.id_for_base) === Number(base.id_for_base));
      console.log("currentCity", currentCity, city);
      return { ...(base.dataValues || base), region: currentCity?.region, city_lokal: currentCity?.city_lokal, institution: currentCity?.institution, date: currentCity?.date };
    });
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

  async getByWhere(country, where) {
    return await this.models[country].bases.findAll({ where });
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
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("id_for_base")), "id_for_base"], "city_lokal", "region", "institution", "date"],
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
