const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const DepartureDate = sequelize.define("departure_date", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departure_id: { type: DataTypes.INTEGER },
  data: { type: DataTypes.DATEONLY },
  trails_id: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlDepartureDate = sequelize.define("pldeparture_dates", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departure_id: { type: DataTypes.INTEGER },
  data: { type: DataTypes.DATEONLY },
  trails_id: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzDepartureDate = sequelize.define("kzdeparture_date", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departure_id: { type: DataTypes.INTEGER },
  data: { type: DataTypes.DATEONLY },
  trails_id: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  DepartureDate,
  PlDepartureDate,
  KzDepartureDate,
};
