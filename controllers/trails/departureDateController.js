const ApiError = require("../../error/ApiError");
const DepartureDateService = require("../../services/trails/departureDateService");
const { Op } = require("sequelize");

class DepartureDateController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await DepartureDateService.getAll(country));
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

    const departures = await DepartureDateService.getByWhere(country, where);

    if (!departures) {
      return next(ApiError.internal("Выезды не найдены"));
    }
    return res.json({ departures });
  }

  async getByDepartureIds(req, res, next) {
    const { country, ids } = req.body;
    if (!country || !ids[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    ids.map((departure_id) => actions.push({ departure_id }));

    let where = {
      [Op.or]: actions,
    };

    const departures = await DepartureDateService.getByWhere(country, where);

    if (!departures) {
      return next(ApiError.internal("Выезды не найдены"));
    }
    return res.json({ departures });
  }

  async create(req, res, next) {
    const { departureDate, country } = req.body;
    if (!departureDate || !country || !departureDate.departure_id || !departureDate.data) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkDepartureDate = await DepartureDateService.getByIdAndDepartureId(country, departureDate.data, departureDate.departure_id);
    if (checkDepartureDate) {
      return next(ApiError.badRequest("Такая дата выезда уже существует"));
    }
    try {
      const newDepartureDate = await DepartureDateService.create({ country, departureDate });
      return res.json(newDepartureDate);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { departureDate, country } = req.body;

    if (!departureDate || !country || !departureDate.id || !departureDate.departure_id || !departureDate.data) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkDeparture = await DepartureDateService.getById(country, departureDate.id);
    if (!checkDeparture) {
      return next(ApiError.badRequest("Выезда с таким id не существует"));
    }
    try {
      const updatedDepartures = await DepartureDateService.update({ country, departureDate });
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
    const item = await DepartureDateService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedDepartures = await DepartureDateService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new DepartureDateController();
