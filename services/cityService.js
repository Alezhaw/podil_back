const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Cities, KzCities, PlCities } = require("../models/models");
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
  async Search() {}
  async UpdateOrCreate(data, user, country) {
    let errors = [];
    await Promise.all(
      data.map(async (item) => {
        if (!item.id_for_base) {
          const lastIdForBase = await this.models[country].max("id_for_base");
          item.id_for_base = lastIdForBase + 4;
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
  async CreateTime(item, user, country) {
    delete item.id;
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
      data: { cities: time.dataValues, country },
    });

    return time.id;
  }
  async UpdateTime(item, user, country) {
    const time = item.id ? await this.GetTimeById(item.id, country) : await this.GetTimeByIdForBaseAndTime(item.id_for_base, item.time, country);

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
          data: { cities: item, country },
        });
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
      data: { cities: updatedCity, country },
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
      data: { cities: updatedCity, country },
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

  async GetFiltered(inProgress, canceled, zamkniete, search, country) {
    let statuses = [];
    if (zamkniete) {
      statuses.push({
        status: 2,
      });
    }
    if (inProgress) {
      statuses.push({
        status: 1,
      });
    }
    if (canceled) {
      statuses.push({
        status: 0,
      });
    }
    let where = {
      [Op.or]: statuses,
    };
    if (search) {
      where.miasto_lokal = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const city = await this.models[country].findAll({ where });
    return city;
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

  async fixDate() {
    let cities = await this.models["KZ"].findAll();
    cities = cities.map((el) => el.dataValues);
    Promise.all(
      cities.map(async (item, index) => {
        let daysDate = [
          item.day_1_date ? item.day_1_date.split("T")[0] || null : null,
          item.day_2_date ? item.day_2_date.split("T")[0] || null : null,
          item.day_3_date ? item.day_3_date.split("T")[0] || null : null,
        ].filter((el) => !!el);
        let days_numbers_for_consent = [item.day_1_numbers_for_1_consent || null, item.day_2_numbers_for_1_consent || null, item.day_3_numbers_for_1_consent || null].filter((el) => !!el);
        let days_topical_quantity_invites = [item.day_1_topical_quantity_invites || null, item.day_2_topical_quantity_invites || null, item.day_3_topical_quantity_invites || null].filter(
          (el) => !!el
        );
        daysDate = daysDate.length > 0 ? daysDate : null;
        days_numbers_for_consent = days_numbers_for_consent.length > 0 ? days_numbers_for_consent : null;
        days_topical_quantity_invites = days_topical_quantity_invites.length > 0 ? days_topical_quantity_invites : null;

        this.models["KZ"].update(
          {
            days_date: daysDate,
            days_numbers_for_consent: days_numbers_for_consent,
            days_topical_quantity_invites: days_topical_quantity_invites,
          },
          { where: { id: item.id } }
        );
      })
    );
    // return await this.models[RU].findAll();
  }

  async getMaxIdForBase(country) {
    return await this.models[country].findAll({
      attributes: [Sequelize.fn("max", Sequelize.col("id_for_base"))],
      raw: true,
    });
  }

  async Get(id, country) {
    return await this.models[country].findOne({ where: { id } });
  }

  async GetTimeByIdForBase(id_for_base, country) {
    return await this.models[country].findOne({ where: { id_for_base } });
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
}

module.exports = new CityService();
