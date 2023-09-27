const { Form, KzForm, PlForm } = require("../../models/trails/formModels");

class FormService {
  models = {
    RU: Form,
    KZ: KzForm,
    PL: PlForm,
  };

  async create({ country, form }) {
    return await this.models[country].create({ ...form });
  }

  async update({ country, form }) {
    return await this.models[country].update({ ...form }, { where: { id: form.id } });
  }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  //   async delete(country, id) {
  //     return await this.models[country].destroy({
  //       where: { id },
  //     });
  //   }

  async getAll(country) {
    return await this.models[country].findAll({
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

module.exports = new FormService();
