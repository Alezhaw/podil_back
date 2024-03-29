const { PresentationTime, KzPresentationTime, PlPresentationTime } = require("../../models/trails/presentationTimeModels");

class PresentationTimeService {
  models = {
    RU: PresentationTime,
    KZ: KzPresentationTime,
    PL: PlPresentationTime,
  };

  async create(country, presentationTime) {
    return await this.models[country].create({ ...presentationTime });
  }

  async update(country, presentationTime) {
    return await this.models[country].update({ ...presentationTime }, { where: { id: presentationTime.id } });
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
      order: [["presentation_hour", "ASC"]],
    });
  }

  async getByWhere(country, where) {
    return await this.models[country].findAll({ where });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, presentation_hour) {
    return await this.models[country].findOne({ where: { presentation_hour } });
  }

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new PresentationTimeService();
