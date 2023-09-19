const { ContactStatus, KzContactStatus, PlContactStatus } = require("../../models/trails/contactStatusModels");

class ContactStatusService {
  models = {
    RU: ContactStatus,
    KZ: KzContactStatus,
    PL: PlContactStatus,
  };

  async create(country, contactStatus) {
    return await this.models[country].create({ contactStatus });
  }

  async update(country, contactStatus, id) {
    return await this.models[country].update({ contactStatus }, { where: { id } });
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

  async getByName(country, contactStatus) {
    return await this.models[country].findOne({ where: { contactStatus } });
  }
}

module.exports = new ContactStatusService();
