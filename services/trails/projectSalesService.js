const { ProjectSales, KzProjectSales, PlProjectSales } = require("../../models/trails/projectSalesModels");

class ProjectSalesService {
  models = {
    RU: ProjectSales,
    KZ: KzProjectSales,
    PL: PlProjectSales,
  };

  async create(country, projectSales) {
    return await this.models[country].create({ ...projectSales });
  }

  async update(country, projectSales) {
    return await this.models[country].update({ ...projectSales }, { where: { id: projectSales.id } });
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

module.exports = new ProjectSalesService();
