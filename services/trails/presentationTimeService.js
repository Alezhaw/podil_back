const { PresentationTime, KzPresentationTime, PlPresentationTime } = require("../../models/trails/planningPersonModels");

class PresentationTimeService {
  models = {
    RU: PresentationTime,
    KZ: KzPresentationTime,
    PL: PlPresentationTime,
  };

  async create(country, presentationTime) {
    return await this.models[country].create({ presentationTime });
  }

  async update(country, presentationTime, id) {
    return await this.models[country].update({ presentationTime }, { where: { id } });
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
    return await this.models[country].findAll();
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, presentationTime) {
    return await this.models[country].findOne({ where: { presentationTime } });
  }
}

module.exports = new PresentationTimeService();
