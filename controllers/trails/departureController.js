const ApiError = require("../../error/ApiError");
const DepartureService = require("../../services/trails/departureService");
const { Op } = require("sequelize");
const sequelize = require("../../db");

class DepartureController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await DepartureService.getAll(country));
  }

  async getByIds(req, res, next) {
    const { country, ids } = req.body;
    if (!country || !ids[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    ids.map((id) => actions.push({ id }));

    let where = {
      [Op.or]: actions,
    };

    const departures = await DepartureService.getByWhere(country, where);

    if (!departures[0]) {
      return next(ApiError.internal("Выезды не найдены"));
    }
    return res.json({ departures });
  }

  async getFiltered(req, res, next) {
    const { country, ids, dateFrom, dateTo } = req.body;
    // if (!country || !ids[0]) {
    //   return next(ApiError.badRequest("Укажите все данные"));
    // }
    models = {
      RU: '"departures"',
      KZ: '"kzdepartures"',
      PL: '"pldepartures"',
    };
    //  let actions = [];

    // ids.map((id) => actions.push({ id }));

    let where = {
      //'SELECT "id", "dates", "range", "relevance_status", "createdAt", "updatedAt" FROM "departures" AS "departure" WHERE "departure"."test" >> ARRAY[1682899200000];'
      range: {
        //[Op.strictRight]: [targetDate],
      },
    };
    const query = `SELECT "id", "dates", "range", "relevance_status", "createdAt", "updatedAt" FROM ${models[country]} AS "departure" ${dateFrom || dateTo ? "WHERE" : ""} ${
      dateFrom ? `"departure"."range" >= ARRAY['${dateFrom}']::DATE[]` : ""
    } ${dateFrom && dateTo ? "AND" : ""}${dateTo ? `"departure"."range" <= ARRAY['${dateTo}']::DATE[]` : ""};`;
    console.log(1, query);
    let departures = await sequelize.query(query);
    //console.log(1, types);

    //const departures = await DepartureService.getByWhere(country, where);

    if (!departures[0][0]) {
      return next(ApiError.internal("Выезды не найдены"));
    }
    return res.json(departures[0]);
  }

  async create(req, res, next) {
    const { departure, country } = req.body;
    if (!departure || !country || !departure.dates || !departure.range) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    try {
      const newDeparture = await DepartureService.create({ country, departure });
      return res.json(newDeparture);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { departure, country } = req.body;

    if (!departure || !country || !departure.id || !departure.dates || !departure.range) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkDeparture = await DepartureService.getById(country, departure.id);
    if (!checkDeparture) {
      return next(ApiError.badRequest("Выезда с таким id не существует"));
    }
    try {
      const updatedDepartures = await DepartureService.update({ country, departure });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res) {
    const { id, country, relevance_status } = req.body;
    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await DepartureService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedDepartures = await DepartureService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new DepartureController();
