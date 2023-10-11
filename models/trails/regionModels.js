const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Region = sequelize.define("regions", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzRegion = sequelize.define("kzregions", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlRegion = sequelize.define("plregions", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  Region,
  KzRegion,
  PlRegion,
};
