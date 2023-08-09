const ApiError = require("../error/ApiError");
const { Logs, LogsForBase } = require("../models/models");

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

    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }
    const logs = await Logs.findAll();
    if (!logs) {
      return next(ApiError.internal("Нет логов по городам"));
    }

    let filteredLogs = logs
      ?.map((item) => item.dataValues)
      ?.filter((el) => (country ? country === el.country : true))
      ?.filter((el) => (search ? el?.miasto_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((item, i, ar) => {
        return ar.map((el) => `${el.miasto_lokal} ${getCorrectTime(el)}`).indexOf(`${item.miasto_lokal} ${getCorrectTime(item)}`) === i;
      })
      ?.filter((checkbox) => (checkbox?.action === "update" && updateFilter) || (checkbox?.action === "create" && createFilter) || (checkbox?.action === "delete" && deleteFilter))
      ?.sort((a, b) => Number(b.id) - Number(a.id));
    const count = Math.ceil(filteredLogs?.length / pageSize);
    filteredLogs = filteredLogs
      ?.slice(page * pageSize - pageSize, page * pageSize)
      ?.map((el) => logs?.filter((log) => log.miasto_lokal === el.miasto_lokal && getCorrectTime(log) === getCorrectTime(el)))
      ?.flat();

    const countries = logs
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.country).indexOf(item.country) === i;
      })
      ?.map((log) => log.country);

    return res.json({ logs: filteredLogs, count, countries });
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
