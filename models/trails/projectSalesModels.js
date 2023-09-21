const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ProjectSales = sequelize.define("project_sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});
const PlProjectSales = sequelize.define("plproject_sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});
const KzProjectSales = sequelize.define("kzproject_sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  ProjectSales,
  PlProjectSales,
  KzProjectSales,
};
