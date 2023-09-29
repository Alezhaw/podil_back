const { Regiment, KzRegiment, PlRegiment } = require("../../models/trails/regimentModels");

class RegimentService {
  models = {
    RU: Regiment,
    KZ: KzRegiment,
    PL: PlRegiment,
  };

  async create(country, regiment) {
    return await this.models[country].create({ regiment });
  }

  async update(country, regiment, id) {
    return await this.models[country].update({ regiment }, { where: { id } });
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

  async getByName(country, regiment) {
    return await this.models[country].findOne({ where: { regiment } });
  }

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new RegimentService();
