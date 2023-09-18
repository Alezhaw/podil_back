const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { CitiesWithReg, KzCitiesWithReg, PlCitiesWithReg } = require("../models/models");
const { Sequelize, Op } = require("sequelize");

class CitiesWithRegService {
  models = {
    RU: CitiesWithReg,
    KZ: KzCitiesWithReg,
    PL: PlCitiesWithReg,
  };

  async create({ country, region_id, city_name, additional_city_name, county, city_type, population, autozonning }) {
    return await this.models[country].create({ region_id, city_name, additional_city_name, county, city_type, population, autozonning });
  }

  async update({ country, id, region_id, city_name, additional_city_name, county, city_type, population, autozonning }) {
    return await this.models[country].update({ region_id, city_name, additional_city_name, county, city_type, population, autozonning }, { where: { id } });
  }

  async delete(country, id) {
    return await this.models[country].destroy({
      where: { id },
    });
  }

  async getAll(country) {
    return await this.models[country].findAll();
  }

  async getByName(country, where) {
    return await this.models[country].findAll({ where });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }
}

module.exports = new CitiesWithRegService();