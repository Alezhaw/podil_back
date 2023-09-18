const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ProjectSales = sequelize.define("project_sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});
const PlProjectSales = sequelize.define("plproject_sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});
const KzProjectSales = sequelize.define("kzproject_sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

module.exports = {
  ProjectSales,
  PlProjectSales,
  KzProjectSales,
};
