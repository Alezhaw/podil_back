const { DepartureDate, KzDepartureDate, PlDepartureDate } = require("../../models/trails/departureDateModels");

class DepartureDateService {
  models = {
    RU: DepartureDate,
    KZ: KzDepartureDate,
    PL: PlDepartureDate,
  };

  async create({ country, departureDate }) {
    return await this.models[country].create({ ...departureDate, relevance_status: true });
  }

  async update({ country, departureDate }) {
    return await this.models[country].update({ ...departureDate }, { where: { id: departureDate.id } });
  }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async removeByDepartureId(country, relevance_status, departure_id) {
    return await this.models[country].update({ relevance_status }, { where: { departure_id } });
  }

  async GetFiltered(country, where, page, pageSize, sort) {
    return await this.models[country].findAll({
      where,
      order: [["id", sort ? "ASC" : "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async getAll(country) {
    return await this.models[country].findAll({
      where: { relevance_status: true },
      order: [["id", "ASC"]],
    });
  }

  async getByWhere(country, where) {
    return await this.models[country].findAll({ where });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByDateAndDepartureId(country, data, departure_id) {
    return await this.models[country].findOne({ where: { data, departure_id, relevance_status: true } });
  }
}

module.exports = new DepartureDateService();
