const { PlanningPerson, KzPlanningPerson, PlPlanningPerson } = require("../../models/trails/planningPersonModels");

class PlanningPersonService {
  models = {
    RU: PlanningPerson,
    KZ: KzPlanningPerson,
    PL: PlPlanningPerson,
  };

  async create(country, planningPeople) {
    return await this.models[country].create({ ...planningPeople });
  }

  async update(country, planningPeople) {
    return await this.models[country].update({ ...planningPeople }, { where: { id: planningPeople.id } });
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

  async getByName(country, name) {
    return await this.models[country].findOne({ where: { name } });
  }

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new PlanningPersonService();
