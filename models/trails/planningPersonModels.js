const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const PlanningPerson = sequelize.define("planning_person", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const KzPlanningPerson = sequelize.define("kzplanning_person", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const PlPlanningPerson = sequelize.define("plplanning_person", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

module.exports = {
  PlanningPerson,
  KzPlanningPerson,
  PlPlanningPerson,
};
