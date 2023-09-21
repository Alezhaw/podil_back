const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ReservationStatus = sequelize.define("reservation_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const PlReservationStatus = sequelize.define("plreservation_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

const KzReservationStatus = sequelize.define("kzreservation_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  relevance_status: { type: DataTypes.BOOLEAN },
});

module.exports = {
  ReservationStatus,
  PlReservationStatus,
  KzReservationStatus,
};
