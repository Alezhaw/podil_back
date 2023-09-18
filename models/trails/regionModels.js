const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Region = sequelize.define("region", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
});

const KzRegion = sequelize.define("kzregion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
});

const PlRegion = sequelize.define("plregion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region: { type: DataTypes.STRING },
});

module.exports = {
  Region,
  KzRegion,
  PlRegion,
};
