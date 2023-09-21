const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ProjectConcent = sequelize.define("project_concent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzProjectConcent = sequelize.define("kzproject_concent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlProjectConcent = sequelize.define("plproject_concent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  ProjectConcent,
  KzProjectConcent,
  PlProjectConcent,
};
