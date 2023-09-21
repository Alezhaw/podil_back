const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const PlanningPerson = sequelize.define("planning_person", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzPlanningPerson = sequelize.define("kzplanning_person", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlPlanningPerson = sequelize.define("plplanning_person", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  PlanningPerson,
  KzPlanningPerson,
  PlPlanningPerson,
};
