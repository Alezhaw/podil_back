const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const ServersQueue = sequelize.define(
  "servers_queue",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    country: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    companyCount: { type: DataTypes.INTEGER },
  },
  { indexes: [{ unique: true, fields: ["country", "url"] }] }
);

module.exports = {
  ServersQueue,
};
