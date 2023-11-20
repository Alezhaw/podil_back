const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const CityHelper = require("../utils/cityHelper");
const { Cities, KzCities, PlCities } = require("../models/citiesModels");
const TrailsService = require("./trails/trailsService");
const { Sequelize, Op } = require("sequelize");

class CityService {
  checkValue(check_base, check_speaker, check_scenario) {
    switch ("boolean") {
      case typeof check_base:
        return { check_base: !!check_base };
      case typeof check_speaker:
        return { check_speaker: !!check_speaker };
      case typeof check_scenario:
        return { check_scenario: !!check_scenario };
    }
  }
  models = {
    RU: Cities,
    KZ: KzCities,
    PL: PlCities,
  };

  filterProperties = {
    zamkniete: {
      status: 2,
    },
    inProgress: [
      {
        status: 1,
      },
      {
        status: 3,
      },
    ],
    canceled: {
      status: 0,
    },
    baseCanceled: {
      status: 0,
    },
    baseZamkniete: {
      [Op.and]: [{ check_base: true }, { status: { [Op.ne]: 0 } }],
    },
    baseInProgress: {
      [Op.and]: [{ check_base: false }, { status: { [Op.ne]: 0 } }],
    },
    scenarioCanceled: {
      status: 0,
    },
    scenarioZamkniete: {
      [Op.and]: [{ check_scenario: true }, { status: { [Op.ne]: 0 } }],
    },
    scenarioInProgress: {
      [Op.and]: [{ check_scenario: false }, { status: { [Op.ne]: 0 } }],
    },
    speakerCanceled: {
      status: 0,
    },
    speakerZamkniete: {
      [Op.and]: [{ check_speaker: true }, { status: { [Op.ne]: 0 } }],
    },
    speakerInProgress: {
      [Op.and]: [{ check_speaker: false }, { status: { [Op.ne]: 0 } }],
    },
    dateTo: {},
    dateFrom: {},
    visibleInPodil: {},
    visibleInBases: {},
    visibleInSpeaker: {},
    visibleInScenario: {},
  };

  async Search() {}
  async UpdateOrCreate(data, user, country) {
    let errors = [];
    data = CityHelper.changeCitiesTime(data, true);
    await Promise.all(
      data.map(async (item) => {
        if (!item.id_for_base) {
          const lastIdForBase = await this.models[country].max("id_for_base");
          item.id_for_base = lastIdForBase + 4;
        }
        if (item.id === "create") {
          delete item.id;
        }
        const time = item.id ? await this.GetTimeById(item.id, country) : await this.GetTimeByIdForBaseAndTime(item.id_for_base, item.time, country);
        if (item?.id !== "create" && !!time) {
          try {
            let result = await this.UpdateTime(item, user, country);
            if (result != item.id) {
              errors.push(result);
            }
          } catch (error) {
            errors.push({
              city: item.city_lokal,
              id_for_base: item.id_for_base,
              error: error.message,
            });
          }
        } else {
          try {
            let result = await this.CreateTime(item, user, country);
            if (typeof result !== "Number") {
              errors.push(result);
            }
          } catch (e) {
            return errors.push({
              city: item.city_lokal,
              id_for_base: item.id_for_base,
              error: e.message,
            });
          }
        }
      })
    );
    return errors;
  }

  async UpdateOrCreateByTrails({ country, data, user, status }) {
    let errors = [];
    data = CityHelper.changeCitiesTime(data, true);
    await Promise.all(
      data.map(async (item) => {
        const time = await this.GetTimeByTrailIdAndTime(item.trailId, item.time, country);
        if (!time) {
          const lastIdForBase = await this.models[country].max("id_for_base");
          item.id_for_base = lastIdForBase + 4;
        }

        if (time) {
          try {
            let result = await this.UpdateTime(item, user, country, status);
            if (result != item.id) {
              errors.push(result);
            }
          } catch (error) {
            errors.push({
              city: item.city_lokal,
              id_for_base: item.id_for_base,
              error: error.message,
            });
          }
        } else {
          try {
            let result = await this.CreateTime(item, user, country, status);
            if (typeof result !== "Number") {
              errors.push(result);
            }
          } catch (e) {
            return errors.push({
              city: item.city_lokal,
              id_for_base: item.id_for_base,
              error: e.message,
            });
          }
        }
      })
    );
    return errors;
  }

  async CreateTime(item, user, country, status) {
    const time = await this.models[country].create(item);
    const result = ObjectHelper.sendDifferencesToDatabase(time, item, country, "create", user, "city");

    if (!result) {
      return {
        city: item.city_lokal,
        id_for_base: item.id_for_base,
        error: "Failed to write log",
      };
    }

    global.io.to("1").emit("updateCities", {
      data: { cities: CityHelper.changeCitiesTime([time.dataValues]), country },
    });

    if (status) {
      await TrailsService.update({ country, trail: { id: item.trailId, ...status } });
      const trail = await TrailsService.getById(country, item.trailId);
      if (trail) {
        global.io.to("1").emit("updateTrails", {
          data: { trails: [trail.dataValues], country },
        });
      }
    }

    return time.id;
  }
  async UpdateTime(item, user, country, status) {
    const time = item.id
      ? await this.GetTimeById(item.id, country)
      : item.trailId
      ? await this.GetTimeByTrailIdAndTime(item.trailId, item.time, country)
      : await this.GetTimeByIdForBaseAndTime(item.id_for_base, item.time, country);

    if (time) {
      try {
        const result = ObjectHelper.sendDifferencesToDatabase(time, item, country, "update", user, "city");
        if (!result) {
          return {
            city: item.city_lokal,
            id_for_base: item.id_for_base,
            error: "Failed to write log",
          };
        }
        await this.Update(item, { id: time.dataValues.id }, country);
        global.io.to("1").emit("updateCities", {
          data: { cities: CityHelper.changeCitiesTime([item]), country },
        });
        if (status) {
          await TrailsService.update({ country, trail: { id: item.trailId, ...status } });
          const trail = await TrailsService.getById(country, item.trailId);
          if (trail) {
            global.io.to("1").emit("updateTrails", {
              data: { trails: [trail.dataValues], country },
            });
          }
        }
      } catch (e) {
        return {
          city: item.city_lokal,
          id_for_base: item.id_for_base,
          error: e.message,
        };
      }
      return time.dataValues.id;
    }
    throw ApiError.internal("Город не найден");
  }

  async ChangeCheck(id, id_for_base, check_base, check_speaker, check_scenario, user, country) {
    const city = id ? await this.GetTimeById(id, country) : await this.GetTimeByIdForBase(id_for_base, country);
    if (!city) {
      throw ApiError.internal("Город не найден");
    }
    const cities = await this.GetTimes(city.dataValues.id_for_base, country);
    const result = cities?.map((city) =>
      ObjectHelper.sendDifferencesToDatabase(city, { ...city.dataValues, ...this.checkValue(check_base, check_speaker, check_scenario) }, country, "update", user, "city")
    );
    if (!result[0]) {
      throw ApiError.internal("Failed to write log");
    }
    const updated = await this.Update(this.checkValue(check_base, check_speaker, check_scenario), { id_for_base: city.id_for_base }, country);
    const updatedCity = await this.GetTimes(city.dataValues.id_for_base, country);
    global.io.to("1").emit("updateCities", {
      data: { cities: CityHelper.changeCitiesTime(updatedCity), country },
    });

    return updatedCity.map((city) => city.id);
  }

  async ChangeStatus(id, id_for_base, status, user, country) {
    const city = id ? await this.GetTimeById(id, country) : await this.GetTimeByIdForBase(id_for_base, country);
    if (!city) {
      throw ApiError.internal("Город не найден");
    }

    const cities = await this.GetTimes(city.id_for_base, country);
    const result = cities?.map((city) => ObjectHelper.sendDifferencesToDatabase(city, { ...city.dataValues, status }, country, "update", user, "city"));
    if (!result[0]) {
      throw ApiError.internal("Failed to write log");
    }
    const updated = await this.Update({ status: status }, { id_for_base: city.id_for_base }, country);

    const updatedCity = await this.GetTimes(city.id_for_base, country);

    global.io.to("1").emit("updateCities", {
      data: { cities: CityHelper.changeCitiesTime(updatedCity), country },
    });

    return updatedCity.map((city) => city.id);
  }

  async DeleteCity(id_for_base, user, country) {
    const times = await this.GetTimes(id_for_base, country);
    if (!times) {
      throw ApiError.internal("Город не найден");
    }

    const result = times?.map((time) => ObjectHelper.sendDifferencesToDatabase(time, time.dataValues, country, "delete", user, "city"));
    if (!result[0]) {
      throw ApiError.internal("Failed to write log");
    }
    try {
      await this.DeleteByIdForBase(id_for_base, country);

      global.io.to("1").emit("deleteCity", {
        data: { deleteCity: id_for_base, country },
      });
      return res.json(id_for_base);
    } catch (e) {
      throw ApiError.internal("Delete failed");
    }
  }

  async DeleteTime(id, user, country) {
    const city = await this.GetTimeById(id, country);
    if (!city) {
      throw ApiError.internal("City not found");
    }
    const result = ObjectHelper.sendDifferencesToDatabase(city, city.dataValues, country, "delete", user, "city");
    if (!result) {
      throw ApiError.internal("Failed to write log");
    }

    try {
      await this.DeleteById(id, country);

      global.io.to("1").emit("deleteCity", {
        data: { deleteTime: id, country },
      });
    } catch (e) {
      throw ApiError.internal("Delete failed");
    }
    return id;
  }

  async GetFiltered({ search, filter, sort, pageSize, page, country }) {
    let statuses = [];
    const filterProperties = this.filterProperties;
    if (filter) {
      const keys = Object.keys(filter);
      keys.map((el) => {
        if (filter[el]) {
          if (filterProperties[el].length) {
            statuses.push(...filterProperties[el]);
          } else {
            statuses.push(filterProperties[el]);
          }
        }
      });
    }

    let where = {
      [Op.or]: statuses,
    };

    let dateFilter = [];
    if (filter.dateTo) {
      dateFilter.push({ [Op.lte]: filter.dateTo });
    }
    if (filter.dateFrom) {
      dateFilter.push({ [Op.gte]: filter.dateFrom });
    }
    if (dateFilter[0]) {
      where.date = {
        [Op.and]: dateFilter,
      };
    }
    if (filter.visibleInPodil) {
      where.visible_in_podil = true;
    }
    if (filter.visibleInBases) {
      where.visible_in_bases = true;
    }
    if (filter.visibleInSpeaker) {
      where.visible_in_speaker = true;
    }
    if (filter.visibleInScenario) {
      where.visible_in_scenario = true;
    }
    if (search) {
      where.city_lokal = {
        [Op.iLike]: `%${search}%`,
      };
    }
    const cities = await this.GetDistinctFiltered(country, where, page, pageSize, sort);
    console.log(1, cities);
    const cityForCount = await this.GetDistinctFilteredForCount(country, where);
    if (!cities || !cityForCount) {
      throw ApiError.internal("Города не найдены");
    }

    let options = [];

    cities.map((el) => {
      el = el.dataValues;
      options.push({
        id_for_base: el.id_for_base,
      });
    });

    let whereWithProperties = {
      [Op.or]: options,
    };

    let citiesWithProperties = await this.GetTimesByManyIdForBase(country, whereWithProperties, sort);
    if (!citiesWithProperties) {
      return next(ApiError.internal("Города не найдены"));
    }

    const count = Math.ceil(cityForCount?.length / pageSize);

    const result = { cities: CityHelper.changeCitiesTime(citiesWithProperties), count };
    return result;
  }

  async Update(newData, where, country) {
    const updated = await this.models[country].update(newData, { where });
  }

  async GetTimeById(id, country) {
    return await this.models[country].findOne({ where: { id } });
  }

  async GetAll(country) {
    return await this.models[country].findAll();
  }

  async getMaxIdForBase(country) {
    return await this.models[country].findAll({
      attributes: [Sequelize.fn("max", Sequelize.col("id_for_base"))], //Sequelize.query() еще можно
      raw: true,
    });
  }

  async Get(id, country) {
    return await this.models[country].findOne({ where: { id } });
  }

  async GetByTrailId(trailId, country) {
    return await this.models[country].findOne({ where: { trailId } });
  }

  async GetDistinctFiltered(country, where, page, pageSize, sort) {
    return await this.models[country].findAll({
      where,
      //attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("id_for_base")), "id_for_base"]],
      attributes: ["id_for_base", "date", Sequelize.fn("count", Sequelize.col("id_for_base"))],
      group: ["id_for_base", "date"],
      // distinct: true,
      // col: "id_for_base",
      // group: ["id_for_base"],
      order: [["date", sort ? "ASC" : "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async GetDistinctFilteredForCount(country, where) {
    return await this.models[country].findAll({
      where,
      attributes: ["id_for_base", "date", Sequelize.fn("count", Sequelize.col("id_for_base"))],
      group: ["id_for_base", "date"],
      //  distinct: true,
      //col: "id_for_base",
    });
  }

  async GetTimesByManyIdForBase(country, where, sort) {
    return await this.models[country].findAll({ where, order: [["date", sort ? "ASC" : "DESC"]] });
  }

  async GetTimeByIdForBase(id_for_base, country) {
    return await this.models[country].findOne({ where: { id_for_base } });
  }
  async GetTimeByTrailIdAndTime(trailId, time, country) {
    return await this.models[country].findOne({ where: { trailId, time } });
  }

  async GetTimeByIdForBaseAndTime(id_for_base, time, country) {
    return await this.models[country].findOne({ where: { id_for_base, time: time } });
  }

  async GetTimes(id_for_base, country) {
    return await this.models[country].findAll({ where: { id_for_base } });
  }

  async DeleteById(id, country) {
    return await this.models[country].destroy({ where: { id } });
  }

  async DeleteByIdForBase(id_for_base, country) {
    return await this.models[country].destroy({ where: { id_for_base } });
  }

  // async fixDate() {
  //   let cities = await this.models["KZ"].findAll();
  //   cities = cities.map((el) => el.dataValues);
  //   Promise.all(
  //     cities.map(async (item, index) => {
  //       let daysDate = [
  //         item.day_1_date ? item.day_1_date.split("T")[0] || null : null,
  //         item.day_2_date ? item.day_2_date.split("T")[0] || null : null,
  //         item.day_3_date ? item.day_3_date.split("T")[0] || null : null,
  //       ].filter((el) => !!el);
  //       let days_numbers_for_consent = [item.day_1_numbers_for_1_consent || null, item.day_2_numbers_for_1_consent || null, item.day_3_numbers_for_1_consent || null].filter((el) => !!el);
  //       let days_topical_quantity_invites = [item.day_1_topical_quantity_invites || null, item.day_2_topical_quantity_invites || null, item.day_3_topical_quantity_invites || null].filter(
  //         (el) => !!el
  //       );
  //       daysDate = daysDate.length > 0 ? daysDate : null;
  //       days_numbers_for_consent = days_numbers_for_consent.length > 0 ? days_numbers_for_consent : null;
  //       days_topical_quantity_invites = days_topical_quantity_invites.length > 0 ? days_topical_quantity_invites : null;

  //       this.models["KZ"].update(
  //         {
  //           days_date: daysDate,
  //           days_numbers_for_consent: days_numbers_for_consent,
  //           days_topical_quantity_invites: days_topical_quantity_invites,
  //         },
  //         { where: { id: item.id } }
  //       );
  //     })
  //   );
  // }
}

module.exports = new CityService();
