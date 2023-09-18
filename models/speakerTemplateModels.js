const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const SpeakerTemplate = sequelize.define("speaker_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING },
  type: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING, unique: true },
  country: { type: DataTypes.STRING },
});

module.exports = {
  SpeakerTemplate,
};
