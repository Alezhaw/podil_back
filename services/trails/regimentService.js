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

  async getAll(country) {
    return await this.models[country].findAll();
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, regiment) {
    return await this.models[country].findOne({ where: { regiment } });
  }
}

module.exports = new RegimentService();
