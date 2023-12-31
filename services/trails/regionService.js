const { Region, KzRegion, PlRegion } = require("../../models/trails/regionModels");

class RegionService {
  models = {
    RU: Region,
    KZ: KzRegion,
    PL: PlRegion,
  };

  async create(country, region) {
    return await this.models[country].create({ ...region });
  }

  async update(country, region) {
    return await this.models[country].update({ ...region }, { where: { id: region.id } });
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
    return await this.models[country].findAll({ where: { relevance_status: true }, order: [["region", "ASC"]] });
  }

  async getByWhere(country, where) {
    return await this.models[country].findAll({ where });
  }

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, region) {
    return await this.models[country].findOne({ where: { region } });
  }
}

module.exports = new RegionService();
