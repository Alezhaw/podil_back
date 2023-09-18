const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const CitiesWithReg = sequelize.define("cities_with_region", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region_id: { type: DataTypes.INTEGER },
  city_name: { type: DataTypes.STRING },
  additional_city_name: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  city_type: { type: DataTypes.STRING },
  population: { type: DataTypes.INTEGER },
  autozonning: { type: DataTypes.STRING },
});
const KzCitiesWithReg = sequelize.define("kzcities_with_region", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region_id: { type: DataTypes.INTEGER },
  city_name: { type: DataTypes.STRING },
  additional_city_name: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  city_type: { type: DataTypes.STRING },
  population: { type: DataTypes.INTEGER },
  autozonning: { type: DataTypes.STRING },
});

const PlCitiesWithReg = sequelize.define("plcities_with_region", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  region_id: { type: DataTypes.INTEGER },
  city_name: { type: DataTypes.STRING },
  additional_city_name: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  city_type: { type: DataTypes.STRING },
  population: { type: DataTypes.INTEGER },
  autozonning: { type: DataTypes.STRING },
});

module.exports = {
  CitiesWithReg,
  KzCitiesWithReg,
  PlCitiesWithReg,
};
