const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Trails = sequelize.define("trail", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  planningPerson: { type: DataTypes.STRING },
  date_scheduled: { type: DataTypes.DATEONLY },
  company: { type: DataTypes.STRING }, // объект в бд regiments
});

module.exports = {
  Trails,
};
