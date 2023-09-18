const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ProjectConcent = sequelize.define("project_concent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const KzProjectConcent = sequelize.define("kzproject_concent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const PlProjectConcent = sequelize.define("plproject_concent", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

module.exports = {
  ProjectConcent,
  KzProjectConcent,
  PlProjectConcent,
};
