const { CitiesWithReg, KzCitiesWithReg, PlCitiesWithReg } = require("../../models/trails/citiesWithRegModels");

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

  async getByWhere(country, where) {
    return await this.models[country].findAll({ where });
  }

  async getByWhereWithLimit(country, where, limit) {
    return await this.models[country].findAll({ where, limit });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }
}

module.exports = new CitiesWithRegService();
