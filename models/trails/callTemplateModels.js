const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const CallTemplate = sequelize.define("call_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const KzCallTemplate = sequelize.define("kzcall_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const PlCallTemplate = sequelize.define("plcall_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

module.exports = {
  CallTemplate,
  KzCallTemplate,
  PlCallTemplate,
};
