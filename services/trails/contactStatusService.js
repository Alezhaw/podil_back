const { ContactStatus, KzContactStatus, PlContactStatus } = require("../../models/trails/contactStatusModels");

class ContactStatusService {
  models = {
    RU: ContactStatus,
    KZ: KzContactStatus,
    PL: PlContactStatus,
  };

  async create(country, contactStatus) {
    return await this.models[country].create({ ...contactStatus });
  }

  async update(country, contactStatus) {
    return await this.models[country].update({ ...contactStatus }, { where: { id: contactStatus.id } });
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

  async getByName(country, name) {
    return await this.models[country].findOne({ where: { name } });
  }

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new ContactStatusService();
