const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ContactStatus = sequelize.define("contract_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlContactStatus = sequelize.define("plcontract_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzContactStatus = sequelize.define("kzcontract_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  ContactStatus,
  PlContactStatus,
  KzContactStatus,
};
