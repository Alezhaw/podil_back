const { Departure, KzDeparture, PlDeparture } = require("../../models/trails/departureModels");

class DepartureService {
  models = {
    RU: Departure,
    KZ: KzDeparture,
    PL: PlDeparture,
  };

  async create({ country, departure }) {
    return await this.models[country].create({ ...departure });
  }

  async update({ country, departure }) {
    return await this.models[country].update({ ...departure }, { where: { id: departure.id } });
  }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
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
}

module.exports = new DepartureService();
