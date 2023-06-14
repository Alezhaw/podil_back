const ApiError = require("../error/ApiError");
const { Logs, LogsForBase } = require("../models/models");

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
    const city = await Logs.findAll();
    if (!city) {
      return next(ApiError.internal("Нет логов по городам"));
    }

    let filteredCities = city
      ?.filter((el) => (search ? el?.miasto_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((checkbox) => (checkbox?.action === "update" && updateFilter) || (checkbox?.action === "create" && createFilter) || (checkbox?.action === "delete" && deleteFilter))
      ?.filter((el) => (country ? country === el.country : true))
      ?.slice(page * pageSize - pageSize, page * pageSize);
    return res.json(filteredCities);
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

    let filteredBases = base
      ?.filter((el) => (search ? el?.base_id?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((checkbox) => (checkbox?.action === "update" && updateFilter) || (checkbox?.action === "create" && createFilter) || (checkbox?.action === "delete" && deleteFilter))
      ?.filter((el) => (country ? country === el.country : true))
      ?.slice(page * pageSize - pageSize, page * pageSize);
    return res.json(filteredBases);
  }
}

module.exports = new LogsController();
