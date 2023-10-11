const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Departure = sequelize.define("departure", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  range: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlDeparture = sequelize.define("pldeparture", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  range: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzDeparture = sequelize.define("kzdeparture", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  range: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  Departure,
  PlDeparture,
  KzDeparture,
};
