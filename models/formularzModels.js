const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Formularz = sequelize.define("formularz", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  miasto: { type: DataTypes.STRING },
  lokal_wybrany: { type: DataTypes.STRING },
  wojewodztwo: { type: DataTypes.STRING },
  checkbox: { type: DataTypes.BOOLEAN },
  data: { type: DataTypes.STRING },
  analiza: { type: DataTypes.STRING },
  lokal: { type: DataTypes.STRING },
  numeracja: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  poprzednia_opinia: { type: DataTypes.STRING },
  informacje_o_lokalu: { type: DataTypes.STRING },
  cena_za_sale: { type: DataTypes.STRING },
  link_strona: { type: DataTypes.STRING },
  link_sali: { type: DataTypes.STRING },
  link_lokal: { type: DataTypes.STRING },
  telefon1: { type: DataTypes.STRING },
  telefon2: { type: DataTypes.STRING },
  telefon3: { type: DataTypes.STRING },
  adres_email: { type: DataTypes.STRING },
  nazwa_sali_i_metraz1: { type: DataTypes.STRING },
  nazwa_sali_i_metraz2: { type: DataTypes.STRING },
  nazwa_sali_i_metraz3: { type: DataTypes.STRING },
  adres_loklau: { type: DataTypes.STRING },
  ogrzewanie: { type: DataTypes.STRING },
  klimatyzacja: { type: DataTypes.STRING },
  informacje_dot_terminow: { type: DataTypes.STRING },
  kolumna_techniczna: { type: DataTypes.INTEGER, unique: true },
  statusForDatabase: { type: DataTypes.INTEGER },
  newScript: { type: DataTypes.BOOLEAN },
});

module.exports = {
  Formularz,
};
