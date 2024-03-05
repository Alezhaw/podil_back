const { CitiesWithReg, KzCitiesWithReg, PlCitiesWithReg } = require("../../models/trails/trailsModels");
const { Sequelize, Op } = require("sequelize");

class CitiesWithRegService {
  models = {
    RU: CitiesWithReg,
    KZ: KzCitiesWithReg,
    PL: PlCitiesWithReg,
  };

  async create({ country, city }) {
    return await this.models[country].create({ ...city });
  }

  async update({ country, city }) {
    return await this.models[country].update({ ...city }, { where: { id: city.id } });
  }

  async delete(country, id) {
    return await this.models[country].destroy({
      where: { id },
    });
  }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async removeByRegion(country, relevance_status, region_id) {
    return await this.models[country].update({ relevance_status }, { where: { region_id } });
  }

  async getAll(country) {
    return await this.models[country].findAll({ where: { relevance_status: true }, order: [["city_name", "ASC"]] });
  }

  async getByWhere(country, where) {
    return await this.models[country].findAll({ where, order: [["city_name", "ASC"]] });
  }

  async getByWhereForRegion(country, where) {
    return await this.models[country].findAll({
      where,
      distinct: true,
      col: "city_name",
      order: [["city_name", "ASC"]],
    });
  }

  async getByWhereWithLimit(country, where, limit) {
    return await this.models[country].findAll({ where, limit, order: [["city_name", "ASC"]] });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }
  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new CitiesWithRegService();
