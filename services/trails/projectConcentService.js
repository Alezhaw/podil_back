const { ProjectConcent, KzProjectConcent, PlProjectConcent } = require("../../models/trails/projectConcentModels");

class ProjectConcentService {
  models = {
    RU: ProjectConcent,
    KZ: KzProjectConcent,
    PL: PlProjectConcent,
  };

  async create(country, projectConcent) {
    return await this.models[country].create({ projectConcent });
  }

  async update(country, projectConcent, id) {
    return await this.models[country].update({ projectConcent }, { where: { id } });
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

  async getByName(country, projectConcent) {
    return await this.models[country].findOne({ where: { projectConcent } });
  }
}

module.exports = new ProjectConcentService();
