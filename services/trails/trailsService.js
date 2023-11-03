const { Trails, KzTrails, PlTrails, CitiesWithReg, KzCitiesWithReg, PlCitiesWithReg } = require("../../models/trails/trailsModels");
const { Sequelize, Op } = require("sequelize");

class TrailsService {
  models = {
    RU: Trails,
    KZ: KzTrails,
    PL: PlTrails,
  };

  cityModels = {
    RU: CitiesWithReg,
    KZ: KzCitiesWithReg,
    PL: PlCitiesWithReg,
  };

  getIncludeBySearch(search, country) {
    return search
      ? [
          {
            model: this.cityModels[country],
            where: {
              [Op.or]: { city_name: { [Op.iLike]: `%${search}%` }, additional_city_name: { [Op.iLike]: `%${search}%` } },
              //city_name: { [Op.iLike]: `%${search}%` },
            },
          },
        ]
      : [];
  }

  async create({ country, trail }) {
    return await this.models[country].create({ ...trail });
  }

  async update({ country, trail }) {
    return await this.models[country].update({ ...trail }, { where: { id: trail.id } });
  }

  //   async delete(country, id) {
  //     return await this.models[country].destroy({
  //       where: { id },
  //     });
  //   }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async removeByDepartureId(country, relevance_status, departure_id) {
    return await this.models[country].update({ relevance_status }, { where: { departure_id } });
  }

  async removeByDepartureDateId(country, relevance_status, departure_date_id) {
    return await this.models[country].update({ relevance_status }, { where: { departure_date_id } });
  }

  async GetFiltered(country, where, page, pageSize, sort) {
    return await this.models[country].findAll({
      where,
      order: [["presentation_date", sort ? "ASC" : "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async GetDistinctFiltered(country, where, page, pageSize, search) {
    const include = this.getIncludeBySearch(search, country);

    return await this.models[country].findAll({
      include,
      where,
      //attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("departure_id")), "departure_id"]],
      distinct: true,
      col: "departure_id",
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async getByWhereWithSearch(country, where, search) {
    const include = this.getIncludeBySearch(search, country);
    return await this.models[country].findAll({ include, where });
  }

  async GetDistinctFilteredForCount(country, where, search) {
    const include = this.getIncludeBySearch(search, country);
    return await this.models[country].count({
      include,
      where,
      distinct: true,
      col: "departure_id",
    });
  }

  async GetFilteredForCount(country, where) {
    return await this.models[country].count({
      where,
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

  async getByIds(country, where) {
    return await this.models[country].findAll({ where });
  }
}

module.exports = new TrailsService();
