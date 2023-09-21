const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const CallTemplate = sequelize.define("call_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzCallTemplate = sequelize.define("kzcall_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlCallTemplate = sequelize.define("plcall_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  CallTemplate,
  KzCallTemplate,
  PlCallTemplate,
};
