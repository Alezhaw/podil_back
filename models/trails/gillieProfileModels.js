const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const GillieProfile = sequelize.define("gillie_profile", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  country_name: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  profile_name: { type: DataTypes.STRING },
  gears: { type: DataTypes.STRING },
  present: { type: DataTypes.STRING },
  simulated_agent: { type: DataTypes.STRING },
  servers_url: { type: DataTypes.ARRAY(DataTypes.STRING) },
  bots: { type: DataTypes.INTEGER },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  GillieProfile,
};
