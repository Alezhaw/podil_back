const { ReservationStatus, KzReservationStatus, PlReservationStatus } = require("../../models/trails/reservationStatusModels");

class ReservationStatusService {
  models = {
    RU: ReservationStatus,
    KZ: KzReservationStatus,
    PL: PlReservationStatus,
  };

  async create(country, reservationStatus) {
    return await this.models[country].create({ reservationStatus });
  }

  async update(country, reservationStatus, id) {
    return await this.models[country].update({ reservationStatus }, { where: { id } });
  }

  async delete(country, id) {
    return await this.models[country].destroy({
      where: { id },
    });
  }

  async getAll(country) {
    return await this.models[country].findAll();
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, reservationStatus) {
    return await this.models[country].findOne({ where: { reservationStatus } });
  }
}

module.exports = new ReservationStatusService();
