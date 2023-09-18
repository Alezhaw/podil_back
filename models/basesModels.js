const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Bases = sequelize.define("base", {
  id_for_base: { type: DataTypes.INTEGER },
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  podzial_id: { type: DataTypes.STRING, unique: true },
  stat_1: { type: DataTypes.STRING },
  stat_2: { type: DataTypes.STRING },
  stat_3: { type: DataTypes.STRING },
  stat_4: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  sort: { type: DataTypes.STRING },
  sogl_1: { type: DataTypes.INTEGER },
  sogl_2: { type: DataTypes.INTEGER },
  sogl_3: { type: DataTypes.INTEGER },
  sogl_4: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.STRING },
});

const KzBases = sequelize.define("kzbase", {
  id_for_base: { type: DataTypes.INTEGER },
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  podzial_id: { type: DataTypes.STRING, unique: true },
  stat_1: { type: DataTypes.STRING },
  stat_2: { type: DataTypes.STRING },
  stat_3: { type: DataTypes.STRING },
  stat_4: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  sort: { type: DataTypes.STRING },
  sogl_1: { type: DataTypes.INTEGER },
  sogl_2: { type: DataTypes.INTEGER },
  sogl_3: { type: DataTypes.INTEGER },
  sogl_4: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.STRING },
});

const PlBases = sequelize.define("plbase", {
  id_for_base: { type: DataTypes.INTEGER },
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  podzial_id: { type: DataTypes.STRING, unique: true },
  stat_1: { type: DataTypes.STRING },
  stat_2: { type: DataTypes.STRING },
  stat_3: { type: DataTypes.STRING },
  stat_4: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  sort: { type: DataTypes.STRING },
  sogl_1: { type: DataTypes.INTEGER },
  sogl_2: { type: DataTypes.INTEGER },
  sogl_3: { type: DataTypes.INTEGER },
  sogl_4: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.STRING },
});

module.exports = {
  Bases,
  KzBases,
  PlBases,
};
