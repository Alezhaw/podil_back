const { Lists, KzLists, PlLists } = require("../../models/lists/listModels");
const { Cities, KzCities, PlCities } = require("../../models/citiesModels");
const { Sequelize, Op } = require("sequelize");

class ListService {
  models = {
    RU: Lists,
    KZ: KzLists,
    PL: PlLists,
  };

  cityModels = {
    RU: Cities,
    KZ: KzCities,
    PL: PlCities,
  };

  async create({ country, listsArray, id_for_base }) {
    let errors = [];
    let lists = [];

    await Promise.all(
      listsArray.map(async (list) => {
        if (!id_for_base) {
          return errors.push({ error: "Укажите id_for_base", id_for_base, full_name: list.full_name, id: list.id });
        }

        if (!!list.id) {
          const checkListId = await this.getById(country, list.id);
          if (checkListId) {
            return errors.push({ error: "Такой список уже есть", id_for_base, full_name: list.full_name, id: list.id });
          }
        }
        const checkCity = await this.GetCityTimeByIdForBase(id_for_base, country);
        if (!checkCity) {
          return errors.push({ error: "Такого города нет", id_for_base });
        }

        try {
          const newList = await this.models[country].create({ ...list, id_for_base, relevance_status: true });
          return lists.push(newList);
        } catch (e) {
          console.log("create list error", e);
          return errors.push({ error: "Непредвиденная ошибка", e });
        }
      })
    );
    const result = { lists, errors };
    return result;
  }

  async update({ country, list }) {
    return await this.models[country].update({ ...list }, { where: { id: list.id } });
  }

  async remove(country, relevance_status, id) {
    return await this.models[country].update({ relevance_status }, { where: { id } });
  }

  async removeByWhere(country, relevance_status, where) {
    return await this.models[country].update({ relevance_status }, { where });
  }

  async removeByIdForBase(country, relevance_status, id_for_base) {
    return await this.models[country].update({ relevance_status }, { where: { id_for_base } });
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

  async getByWhereWithLimit(country, where, pageSize, page) {
    return await this.models[country].findAll({ where, order: [["full_name", "ASC"]], offset: (page - 1) * pageSize, limit: pageSize });
  }

  async getDistinctFiltered(country, where) {
    return await this.models[country].findAll({
      where,
      attributes: ["id_for_base", "who_called", "time", Sequelize.fn("count", Sequelize.col("id_for_base"))],
      group: ["id_for_base", "who_called", "time"],
    });
  }

  async getForCount(country, where) {
    return await this.models[country].count({
      where,
    });
  }

  async getById(country, id) {
    return await this.models[country].findOne({ where: { id } });
  }

  async GetCityTimeByIdForBase(id_for_base, country) {
    return await this.cityModels[country].findOne({ where: { id_for_base } });
  }
}

module.exports = new ListService();
