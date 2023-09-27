const { PlanningPerson, KzPlanningPerson, PlPlanningPerson } = require("../../models/trails/planningPersonModels");

class PlanningPersonService {
  models = {
    RU: PlanningPerson,
    KZ: KzPlanningPerson,
    PL: PlPlanningPerson,
  };

  async create(country, planningPerson) {
    return await this.models[country].create({ planningPerson });
  }

  async update(country, planningPerson, id) {
    return await this.models[country].update({ planningPerson }, { where: { id } });
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
      order: [["id", "ASC"]],
    });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async getByName(country, planningPerson) {
    return await this.models[country].findOne({ where: { planningPerson } });
  }
}

module.exports = new PlanningPersonService();
