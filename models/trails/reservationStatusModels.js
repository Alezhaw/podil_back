const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const ReservationStatus = sequelize.define("reservation_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const PlReservationStatus = sequelize.define("plreservation_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

const KzReservationStatus = sequelize.define("kzreservation_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

module.exports = {
  ReservationStatus,
  PlReservationStatus,
  KzReservationStatus,
};
