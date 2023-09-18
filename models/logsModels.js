const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Logs = sequelize.define("log", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  country: { type: DataTypes.STRING },
  action: { type: DataTypes.STRING },
  user_id: { type: DataTypes.INTEGER },
  user_email: { type: DataTypes.STRING },
  differences: { type: DataTypes.JSON },
  id_for_base: { type: DataTypes.INTEGER },
  godzina: { type: DataTypes.STRING },
  miasto_lokal: { type: DataTypes.STRING },
  time: { type: DataTypes.DATE },
});

const LogsForBase = sequelize.define("logs_for_base", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  country: { type: DataTypes.STRING },
  action: { type: DataTypes.STRING },
  user_id: { type: DataTypes.INTEGER },
  user_email: { type: DataTypes.STRING },
  differences: { type: DataTypes.JSON },
  id_base: { type: DataTypes.INTEGER },
  base_id: { type: DataTypes.STRING },
  time: { type: DataTypes.DATE },
});

module.exports = {
  Logs,
  LogsForBase,
};
