const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Region = sequelize.define("region", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzRegion = sequelize.define("kzregion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlRegion = sequelize.define("plregion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  Region,
  KzRegion,
  PlRegion,
};
