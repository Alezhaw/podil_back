const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const CreateCompanyQueue = sequelize.define(
  "createCompanyQueue",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trailId: { type: DataTypes.INTEGER },
    country: { type: DataTypes.STRING },
    autozonning: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING },
    comment: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    profileId: { type: DataTypes.INTEGER },
  },
  { indexes: [{ unique: true, fields: ["autozonning", "trailId", "date", "comment", "name"] }] }
);

module.exports = {
  CreateCompanyQueue,
};
