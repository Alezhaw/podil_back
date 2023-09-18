const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Regiment = sequelize.define("regiment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const PlRegiment = sequelize.define("plregiment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const KzRegiment = sequelize.define("kzregiment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

module.exports = {
  Regiment,
  PlRegiment,
  KzRegiment,
};
