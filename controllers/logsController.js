const ApiError = require("../error/ApiError");
const { Logs, LogsForBase } = require("../models/models");
const { Sequelize, Op } = require("sequelize");

function getCorrectTime(element) {
  return String(element.time).split(".")[0]?.replace("T", " ") || element.time;
}

class LogsController {
  async getAllCitiesLog(req, res) {
    const logs = await Logs.findAll();
    return res.json(logs);
  }

  async getFilteredLogsCities(req, res, next) {
    const { search, country, updateFilter, createFilter, deleteFilter, pageSize, page } = req.body;
    let actions = [];

    if (updateFilter) {
      actions.push({
        action: "update",
      });
    }
    if (createFilter) {
      actions.push({
        action: "create",
      });
    }
    if (deleteFilter) {
      actions.push({
        action: "delete",
      });
    }
    let where = {
      [Op.or]: actions,
    };
    if (country) {
      where.country = country;
    }
    if (search) {
      where.miasto_lokal = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }
    const logs = await Logs.findAll({
      where,
      limit: 100,
      // order: [["miasto_lokal", "DESC"]],
    });
    const testCount = await Logs.count({
      // include: ...,
      // where: ...,
      distinct: true,
      col: "log.time",
    });
    if (!logs) {
      return next(ApiError.internal("Нет логов по городам"));
    }

    let filteredLogs = logs
      ?.map((item) => item.dataValues)
      ?.filter((item, i, ar) => {
        return ar.map((el) => `${el.miasto_lokal} ${getCorrectTime(el)}`).indexOf(`${item.miasto_lokal} ${getCorrectTime(item)}`) === i;
      });

    const count = Math.ceil(filteredLogs?.length / pageSize);
    filteredLogs = filteredLogs
      ?.sort((a, b) => b.id - a.id)
      ?.slice(page * pageSize - pageSize, page * pageSize)
      ?.map((el) => logs?.filter((log) => log.miasto_lokal === el.miasto_lokal && getCorrectTime(log) === getCorrectTime(el)))
      ?.flat();

    const countries = logs
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.country).indexOf(item.country) === i;
      })
      ?.map((log) => log.country);

    // const test = await Logs.findAll({
    //   where,
    // });
    // return res.json({ test });

    return res.json({ logs: filteredLogs, count, countries, testCount }); //Если поиск по стране то список стран не возвращает
  }

  async getAllBasesLog(req, res) {
    const logs = await LogsForBase.findAll();
    return res.json(logs);
  }

  async getFilteredLogsBases(req, res, next) {
    const { search, country, updateFilter, createFilter, deleteFilter, pageSize, page } = req.body;

    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }
    const base = await LogsForBase.findAll();
    if (!base) {
      return next(ApiError.internal("Нет логов по городам"));
    }

    let filteredLogs = base
      ?.filter((el) => (country ? country === el.country : true))
      ?.filter((el) => (search ? el?.podzial_id?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((checkbox) => (checkbox?.action === "update" && updateFilter) || (checkbox?.action === "create" && createFilter) || (checkbox?.action === "delete" && deleteFilter))
      ?.sort((a, b) => Number(b.id) - Number(a.id));
    const count = Math.ceil(filteredLogs?.length / pageSize);
    filteredLogs = filteredLogs?.slice(page * pageSize - pageSize, page * pageSize);

    const countries = base
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.country).indexOf(item.country) === i;
      })
      ?.map((log) => log.country);

    return res.json({ logs: filteredLogs, count, countries });
  }
}

module.exports = new LogsController();
