const { ProjectConcent, KzProjectConcent, PlProjectConcent } = require("../../models/trails/projectConcentModels");

class ProjectConcentService {
  models = {
    RU: ProjectConcent,
    KZ: KzProjectConcent,
    PL: PlProjectConcent,
  };

  async create(country, projectConcent) {
    return await this.models[country].create({ ...projectConcent });
  }

  async update(country, projectConcent) {
    return await this.models[country].update({ ...projectConcent }, { where: { id: projectConcent.id } });
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

module.exports = new ProjectConcentService();
