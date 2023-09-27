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

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async getAll(country) {
    return await this.models[country].findAll({
      order: [["id", "ASC"]],
    });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, reservationStatus) {
    return await this.models[country].findOne({ where: { reservationStatus } });
  }

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new ReservationStatusService();
