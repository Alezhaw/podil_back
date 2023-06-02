const ApiError = require("../error/ApiError");
const { Logs, LogsForBase } = require("../models/models");

class LogsController {
  async getAllCitiesLog(req, res) {
    const logs = await Logs.findAll();
    return res.json(logs);
  }

  async getAllBasesLog(req, res) {
    const logs = await LogsForBase.findAll();
    return res.json(logs);
  }
}

module.exports = new LogsController();
