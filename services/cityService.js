const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Cities, KzCities } = require("../models/models");
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

        if (item?.id !== "create") {
          try {
            let result = await this.UpdateTime(item, user, country);
            if (result != item.id) {
              errors.push(result);
            }
          } catch (error) {
            return next(error);
          }
        }
        try {
          let result = await this.CreateTime(item, user, country);
          if (typeof result !== "Number") {
            errors.push(result);
          }
        } catch (e) {
          return errors.push({
            miasto: item.miasto_lokal,
            id_for_base: item.id_for_base,
            error: e.message,
          });
        }
      })
    );
    return errors;
  }
  async CreateTime(item, user, country) {
    delete item.id;

    const result = ObjectHelper.sendDifferencesToDatabase(city, item, country, "create", user, "city");

    if (!result) {
      return {
        miasto: item.miasto_lokal,
        id_for_base: item.id_for_base,
        error: "Failed to write log",
      };
    }

    const time = await this.models[country].create(item);

    global.io.to("1").emit("updateCities", {
      data: { cities: city.dataValues },
    });

    return time.id;
  }
  async UpdateTime(item, user, country) {
    const time = (await this.GetTimeById(item.id, country)) || (await this.GetTimeByIdForBaseAndTime(item.id_for_base, item.godzina, country));

    if (time) {
      try {
        const result = ObjectHelper.sendDifferencesToDatabase(time, item, country, "update", user, "city");
        if (!result) {
          return {
            miasto: item.miasto_lokal,
            id_for_base: item.id_for_base,
            error: "Failed to write log",
          };
        }
        await this.Update(item, { id: time.id });
        updated = `${updated}/${item.id_for_base}`;
        global.io.to("1").emit("updateCities", {
          data: { cities: item },
        });
      } catch (e) {
        return {
          miasto: item.miasto_lokal,
          id_for_base: item.id_for_base,
          error: e.message,
        };
      }
      return time.id;
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
    console.log(cities);
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
    const times = await GetTimes(id_for_base, country);
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
    console.log(city);
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

  async Get(id, country) {
    return await this.models[country].findOne({ where: { id } });
  }

  async GetTimeByIdForBase(id_for_base, country) {
    return await this.models[country].findOne({ where: { id_for_base } });
  }
  async GetTimeByIdForBaseAndTime(id_for_base, time, country) {
    return await this.models[country].findOne({ where: { id_for_base, godzina: time } });
  }

  async GetTimes(id_for_base, country) {
    console.log(country);
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