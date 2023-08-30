const ApiError = require("../error/ApiError");
const { Logs, LogsForBase } = require("../models/models");
const { Sequelize, Op } = require("sequelize");

// function getCorrectTime(element) {
//   return String(element.time).split(".")[0]?.replace("T", " ") || element.time;
// }
// function getCorrectTime(time) {
//   time = new Date(time);
//   return String(time).split(".")[0] || time;
// }

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

    const logs = await Logs.findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("time"), Sequelize.col("miasto_lokal"), Sequelize.col("user_id")), "all"], "time", "miasto_lokal", "user_id"],
      order: [["time", "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    let countries = await Logs.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("country")), "country"]],
    });
    countries = countries?.map((el) => el.dataValues.country);
    const logsForCount = await Logs.findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("time"), Sequelize.col("miasto_lokal"), Sequelize.col("user_id")), "all"]],
    });
    if (!logs || !logsForCount) {
      return next(ApiError.internal("Нет логов по городам"));
    }
    let optionsForLogs = [];

    logs.map((el) => {
      el = el.dataValues;
      let time = new Date(el.time);
      const hours = time.getHours();
      const timezone = time.getTimezoneOffset();
      time.setHours(hours - timezone / 60);
      optionsForLogs.push({
        time: time,
        miasto_lokal: el.miasto_lokal,
        user_id: el.user_id,
      });
    });

    let whereForLogsWithProperties = {
      [Op.or]: optionsForLogs,
    };

    const logsWitgProperties = await Logs.findAll({
      where: whereForLogsWithProperties,
    });
    if (!logsWitgProperties) {
      return next(ApiError.internal("Логи не найдены"));
    }

    const count = Math.ceil(logsForCount?.length / pageSize);

    return res.json({ logs: logsWitgProperties, count, countries });
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
      where.base_id = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const base = await LogsForBase.findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("time"), Sequelize.col("base_id"), Sequelize.col("user_id")), "all"], "time", "base_id", "user_id"],
      order: [["time", "DESC"]],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    console.log(1, base);

    let countries = await LogsForBase.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("country")), "country"]],
    });
    countries = countries?.map((el) => el.dataValues.country);

    const logsForCount = await LogsForBase.findAll({
      where,
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("time"), Sequelize.col("base_id"), Sequelize.col("user_id")), "all"]],
    });

    if (!base || !logsForCount) {
      return next(ApiError.internal("Нет логов по базам"));
    }

    let optionsForLogs = [];

    base.map((el) => {
      el = el.dataValues;
      // let time = new Date(el.time);
      //const hours = time.getHours();
      //const timezone = time.getTimezoneOffset();
      //time.setHours(hours - timezone / 60);
      optionsForLogs.push({
        time: el.time,
        base_id: el.base_id,
        user_id: el.user_id,
      });
    });

    let whereForLogsWithProperties = {
      [Op.or]: optionsForLogs,
    };

    const logsWitgProperties = await LogsForBase.findAll({
      where: whereForLogsWithProperties,
    });
    if (!logsWitgProperties) {
      return next(ApiError.internal("Логи не найдены"));
    }

    const count = Math.ceil(logsForCount?.length / pageSize);

    return res.json({ logs: logsWitgProperties, count, countries });
  }
}

module.exports = new LogsController();
