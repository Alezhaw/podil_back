const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const PresentationTime = sequelize.define("presentation_time", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzPresentationTime = sequelize.define("kzpresentation_time", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlPresentationTime = sequelize.define("plpresentation_time", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  PresentationTime,
  KzPresentationTime,
  PlPresentationTime,
};
