const { CallTemplate, KzCallTemplate, PlCallTemplate } = require("../../models/trails/callTemplateModels");

class CallTemplateService {
  models = {
    RU: CallTemplate,
    KZ: KzCallTemplate,
    PL: PlCallTemplate,
  };

  async create(country, callTemplate) {
    return await this.models[country].create({ callTemplate });
  }

  async update(country, callTemplate, id) {
    return await this.models[country].update({ callTemplate }, { where: { id } });
  }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async delete(country, id) {
    return await this.models[country].destroy({
      where: { id },
    });
  }

  async getAll(country) {
    return await this.models[country].findAll({
      order: [["id", "ASC"]],
    });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, callTemplate) {
    return await this.models[country].findOne({ where: { callTemplate } });
  }
}

module.exports = new CallTemplateService();
