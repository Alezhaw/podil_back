const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const PresentationTime = sequelize.define("presentation_time", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
});

const KzPresentationTime = sequelize.define("kzpresentation_time", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
});

const PlPresentationTime = sequelize.define("plpresentation_time", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
});

module.exports = {
  PresentationTime,
  KzPresentationTime,
  PlPresentationTime,
};
