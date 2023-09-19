const ApiError = require("../../error/ApiError");
const ReservationStatusService = require("../../services/trails/reservationStatusService");

class ReservationStatusController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await ReservationStatusService.getAll(country));
  }

  async create(req, res, next) {
    const { reservationStatus, country } = req.body;
    if (!reservationStatus || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkReservationStatus = await ReservationStatusService.getByName(country, reservationStatus);
    if (checkReservationStatus) {
      return next(ApiError.badRequest("ReservationStatus с таким именем уже существует"));
    }
    try {
      const newReservationStatus = await ReservationStatusService.create(country, reservationStatus);
      return res.json(newReservationStatus);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { reservationStatus, country, id } = req.body;

    if (!reservationStatus || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkReservationStatusName = await ReservationStatusService.getByName(country, reservationStatus);
    if (checkReservationStatusName) {
      return next(ApiError.badRequest("ReservationStatus с таким именем уже существует"));
    }
    const checkReservationStatusId = await ReservationStatusService.getById(country, id);
    if (!checkReservationStatusId) {
      return next(ApiError.badRequest("ReservationStatus с таким id не существует"));
    }
    try {
      const updatedReservationStatus = await ReservationStatusService.update(country, reservationStatus, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async delete(req, res, next) {
    const { country, id } = req.body;

    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkReservationStatusId = await ReservationStatusService.getById(country, id);
    if (!checkReservationStatusId) {
      return next(ApiError.badRequest("ReservationStatus с таким id не существует"));
    }
    try {
      await ReservationStatusService.delete(country, id);
      return res.json({ ...checkReservationStatusId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new ReservationStatusController();
