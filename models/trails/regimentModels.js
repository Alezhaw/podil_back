const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Regiment = sequelize.define("regiments", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlRegiment = sequelize.define("plregiments", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzRegiment = sequelize.define("kzregiments", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  Regiment,
  PlRegiment,
  KzRegiment,
};
