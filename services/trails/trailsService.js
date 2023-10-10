const { Trails, KzTrails, PlTrails } = require("../../models/trails/trailsModels");
const { Sequelize } = require("sequelize");

class TrailsService {
  models = {
    RU: Trails,
    KZ: KzTrails,
    PL: PlTrails,
  };

  async create({ country, trail }) {
    return await this.models[country].create({ ...trail });
  }

  async update({ country, trail }) {
    return await this.models[country].update({ ...trail }, { where: { id: trail.id } });
  }

  //   async delete(country, id) {
  //     return await this.models[country].destroy({
  //       where: { id },
  //     });
  //   }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async GetFiltered(country, where, page, pageSize, sort) {
    return await this.models[country].findAll({
      where,
      order: [["presentation_date", sort ? "ASC" : "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async GetDistinctFiltered(country, where, page, pageSize, sort) {
    return await this.models[country].findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("departure_id")), "departure_id"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async GetDistinctFilteredForCount(country, where, page, pageSize, sort) {
    return await this.models[country].findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("departure_id")), "departure_id"]],
    });
  }

  async GetFilteredForCount(country, where) {
    return await this.models[country].findAll({
      where,
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

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new TrailsService();
