const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { KzCities } = require("../models/models");

function checkValue(check_base, check_speaker, check_scenario) {
  switch ("boolean") {
    case typeof check_base:
      return { check_base: !!check_base };
    case typeof check_speaker:
      return { check_speaker: !!check_speaker };
    case typeof check_scenario:
      return { check_scenario: !!check_scenario };
  }
}

class CitiesController {
  async create(req, res, next) {
    let user = req.user;
    const { data } = req.body;
    let updated = "";
    let not_id_for_base = "";
    let error = [];
    let cities = [];
    let citiesForWebSocket = [];
    const forPostman = [{ ...req.body }];
    const result = await Promise.all(
      data.map(async (item, index) => {
        if (!item.id_for_base) {
          const cities = await KzCities.findAll();
          const lastIdForBase = cities?.reduce((sum, el) => (Number(el.id_for_base) > sum ? Number(el.id_for_base) : sum), 0);
          //not_id_for_base = `${not_id_for_base}/${item.miasto_lokal}`;
          item.id_for_base = Number(lastIdForBase) + 4;
        }
        if (item?.id !== "create") {
          const checkUnique = (await KzCities.findOne({ where: { id: Number(item.id) || null } })) || (await KzCities.findOne({ where: { id_for_base: item.id_for_base, godzina: item.godzina } }));

          if (checkUnique) {
            try {
              const result = ObjectHelper.sendDifferencesToDatabase(checkUnique, item, "kazakhstan", "update", user, "city");
              if (!result) {
                error.push({
                  miasto: item.miasto_lokal,
                  id_for_base: item.id_for_base,
                  error: "Failed to write log",
                });
                return;
              }
              await KzCities.update(item, { where: { id: checkUnique.id } });
              updated = `${updated}/${item.id_for_base}`;
              citiesForWebSocket.push(item);
              return;
            } catch (e) {
              return error.push({
                miasto: item.miasto_lokal,
                id_for_base: item.id_for_base,
                error: e.message,
              });
            }
          }
        }
        try {
          delete item.id;
          const city = await KzCities.create(item);
          cities.push(city.dataValues);
          citiesForWebSocket.push(city.dataValues);
          const result = ObjectHelper.sendDifferencesToDatabase(city, item, "kazakhstan", "create", user, "city");
          if (!result) {
            error.push({
              miasto: item.miasto_lokal,
              id_for_base: item.id_for_base,
              error: "Failed to write log",
            });
          }
        } catch (e) {
          return error.push({
            miasto: item.miasto_lokal,
            id_for_base: item.id_for_base,
            error: e.message,
          });
        }
      })
    );

    if (citiesForWebSocket[0]) {
      global.io.to("1").emit("updateCitiesKz", {
        data: { cities: citiesForWebSocket },
      });
    }

    return res.json({
      cities,
      updated,
      not_id_for_base,
      error,
    });
  }

  async getAll(req, res) {
    const cities = await KzCities.findAll();
    return res.json(cities);
  }

  async getFilteredCities(req, res, next) {
    const { search, inProgress, zamkniete, baseInProgress, baseZamkniete, scenarioInProgress, scenarioZamkniete, speakerInProgress, speakerZamkniete, sort, pageSize, page } = req.body;

    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }
    const city = await KzCities.findAll();
    if (!city) {
      return next(ApiError.internal("Нет городов в базе данных"));
    }

    let filteredCities = city
      ?.filter((el) => (search ? el?.miasto_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.id_for_base).indexOf(item.id_for_base) === i;
      })
      ?.filter((checkbox) => (!checkbox?.zamkniete && inProgress) || (!!checkbox?.zamkniete && zamkniete))
      ?.filter((checkbox) => (!checkbox?.check_base && baseInProgress) || (!!checkbox?.check_base && baseZamkniete))
      ?.filter((checkbox) => (!checkbox?.check_scenario && scenarioInProgress) || (!!checkbox?.check_scenario && scenarioZamkniete))
      ?.filter((checkbox) => (!checkbox?.check_speaker && speakerInProgress) || (!!checkbox?.check_speaker && speakerZamkniete))
      ?.sort((a, b) => (!sort ? Number(b.id_for_base) - Number(a.id_for_base) : Number(a.id_for_base) - Number(b.id_for_base)));
    const count = Math.ceil(filteredCities?.length / pageSize);
    filteredCities = filteredCities
      ?.slice(page * pageSize - pageSize, page * pageSize)
      ?.map((el) => city?.filter((time) => time.id_for_base === el.id_for_base))
      ?.flat();

    return res.json({ cities: filteredCities, count });
  }

  async getOneCity(req, res, next) {
    const { id, id_for_base } = req.body;

    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    const city = id ? await KzCities.findOne({ where: { id: Number(id) } }) : await KzCities.findAll({ where: { id_for_base: Number(id_for_base) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    return res.json(city);
  }

  async changeCheck(req, res, next) {
    const { id, id_for_base, check_base, check_speaker, check_scenario } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (typeof (check_base ?? check_speaker ?? check_scenario) !== "boolean") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    const city = id ? await KzCities.findOne({ where: { id: Number(id) || null } }) : await KzCities.findOne({ where: { id_for_base } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }

    const cities = await KzCities.findAll({ where: { id_for_base: city.id_for_base } });

    const result = cities?.map((city) =>
      ObjectHelper.sendDifferencesToDatabase(city, { ...city.dataValues, ...checkValue(check_base, check_speaker, check_scenario) }, "kazakhstan", "update", user, "city")
    );
    if (!result[0]) {
      return next(ApiError.internal("Failed to write log"));
    }
    const updated = await KzCities.update(checkValue(check_base, check_speaker, check_scenario), { where: { id_for_base: city.id_for_base } });

    const updatedCity = await KzCities.findAll({ where: { id_for_base: city.id_for_base } });

    global.io.to("1").emit("updateCitiesKz", {
      data: { cities: updatedCity },
    });

    return res.json("Успешно");
  }

  async deleteCity(req, res, next) {
    const { id_for_base } = req.body;
    let user = req.user;

    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    const city = await KzCities.findOne({ where: { id_for_base: Number(id_for_base) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }

    const cities = await KzCities.findAll({ where: { id_for_base: Number(id_for_base) } });

    const result = cities?.map((city) => ObjectHelper.sendDifferencesToDatabase(city, city.dataValues, "kazakhstan", "delete", user, "city"));
    if (!result[0]) {
      return next(ApiError.internal("Failed to write log"));
    }
    try {
      await KzCities.destroy({
        where: { id_for_base: city.id_for_base },
      });

      global.io.to("1").emit("deleteCityKz", {
        data: { deleteCity: city.id_for_base },
      });

      return res.json({ ...city.dataValues });
    } catch (e) {
      return next(ApiError.internal("Delete failed"));
    }
  }

  async deleteOneTime(req, res, next) {
    const { id } = req.body;
    let user = req.user;
    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }
    const city = await KzCities.findOne({ where: { id: Number(id) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    const result = ObjectHelper.sendDifferencesToDatabase(city, city.dataValues, "kazakhstan", "delete", user, "city");
    if (!result) {
      return next(ApiError.internal("Failed to write log"));
    }
    try {
      await KzCities.destroy({
        where: { id },
      });

      global.io.to("1").emit("deleteCityKz", {
        data: { deleteTime: id },
      });
    } catch (e) {
      return next(ApiError.internal("Delete failed"));
    }

    return res.json({ ...city.dataValues });
  }
}

module.exports = new CitiesController();
