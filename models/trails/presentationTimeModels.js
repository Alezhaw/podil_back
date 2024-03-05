const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const PresentationTime = sequelize.define("presentation_times", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
  alternative: { type: DataTypes.BOOLEAN, allowNull: false },
});

const KzPresentationTime = sequelize.define("kzpresentation_times", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
  alternative: { type: DataTypes.BOOLEAN, allowNull: false },
});

const PlPresentationTime = sequelize.define("plpresentation_times", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  presentation_hour: { type: DataTypes.ARRAY(DataTypes.STRING) },
  rental_hours: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
  alternative: { type: DataTypes.BOOLEAN, allowNull: false },
});

module.exports = {
  PresentationTime,
  KzPresentationTime,
  PlPresentationTime,
};
