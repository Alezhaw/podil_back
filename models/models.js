const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Logs = sequelize.define("log", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  country: { type: DataTypes.STRING },
  action: { type: DataTypes.STRING },
  user_id: { type: DataTypes.INTEGER },
  user_email: { type: DataTypes.STRING },
  differences: { type: DataTypes.JSON },
  id_for_base: { type: DataTypes.INTEGER },
  godzina: { type: DataTypes.STRING },
  miasto_lokal: { type: DataTypes.STRING },
  time: { type: DataTypes.DATE },
});

const LogsForBase = sequelize.define("logs_for_base", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  country: { type: DataTypes.STRING },
  action: { type: DataTypes.STRING },
  user_id: { type: DataTypes.INTEGER },
  user_email: { type: DataTypes.STRING },
  differences: { type: DataTypes.JSON },
  id_base: { type: DataTypes.INTEGER },
  base_id: { type: DataTypes.STRING },
  time: { type: DataTypes.DATE },
});

const Bases = sequelize.define("base", {
  id_for_base: { type: DataTypes.INTEGER },
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  base_id: { type: DataTypes.STRING, unique: true },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_type: { type: DataTypes.STRING },
  base_sort: { type: DataTypes.STRING },
  base_sogl_1: { type: DataTypes.INTEGER },
  base_sogl_2: { type: DataTypes.INTEGER },
  base_sogl_3: { type: DataTypes.INTEGER },
  base_comment: { type: DataTypes.STRING },
});

const KzBases = sequelize.define("kzbase", {
  id_for_base: { type: DataTypes.INTEGER },
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  base_id: { type: DataTypes.STRING, unique: true },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_type: { type: DataTypes.STRING },
  base_sort: { type: DataTypes.STRING },
  base_sogl_1: { type: DataTypes.INTEGER },
  base_sogl_2: { type: DataTypes.INTEGER },
  base_sogl_3: { type: DataTypes.INTEGER },
  base_comment: { type: DataTypes.STRING },
});

const Cities = sequelize.define("city", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  l_p: { type: DataTypes.INTEGER },
  godzina: { type: DataTypes.STRING },
  os_poj: { type: DataTypes.STRING },
  pary: { type: DataTypes.STRING },
  wyjasnienia: { type: DataTypes.BOOLEAN },
  projekt: { type: DataTypes.STRING },
  miasto_lokal: { type: DataTypes.STRING },
  timezone: { type: DataTypes.INTEGER },
  limit: { type: DataTypes.INTEGER },
  dodawanie_rekordow: { type: DataTypes.STRING },
  scenariusze: { type: DataTypes.STRING },
  weryfikacja_dkj: { type: DataTypes.STRING },
  podpinanie_scenariuszy: { type: DataTypes.STRING },
  present: { type: DataTypes.STRING },
  rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  wb_1: { type: DataTypes.STRING },
  wb_2: { type: DataTypes.INTEGER },
  ilosc_zaproszen: { type: DataTypes.INTEGER },
  dzien_1_data: { type: DataTypes.STRING },
  dzien_1_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  dzien_1_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
  dzien_2_data: { type: DataTypes.STRING },
  dzien_2_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  dzien_2_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
  dzien_3_data: { type: DataTypes.STRING },
  dzien_3_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  dzien_3_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
  vip_id: { type: DataTypes.STRING },
  vip_format: { type: DataTypes.STRING },
  vip_limit: { type: DataTypes.STRING },
  vip_coming: { type: DataTypes.STRING },
  vip_total_steam: { type: DataTypes.STRING },
  vip_percent_coming: { type: DataTypes.STRING },
  system: { type: DataTypes.STRING },
  zgoda_wyniki_potwierdzen: { type: DataTypes.INTEGER },
  odmowy_wyniki_potwierdzen: { type: DataTypes.INTEGER },
  kropki_wyniki_potwierdzen: { type: DataTypes.INTEGER },
  sms_umawianie: { type: DataTypes.BOOLEAN },
  sms_potwierdzen: { type: DataTypes.BOOLEAN },
  wiretap_note: { type: DataTypes.STRING },
  wiretapping_sogl: { type: DataTypes.STRING },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_stat_4: { type: DataTypes.STRING },
  base_stat_5: { type: DataTypes.STRING },
  id_for_base: { type: DataTypes.INTEGER },
  w_toku: { type: DataTypes.BOOLEAN },
  zamkniete: { type: DataTypes.BOOLEAN },
  base_stat_6: { type: DataTypes.STRING },
  zgody_inne_miasto: { type: DataTypes.INTEGER },
  check_base: { type: DataTypes.BOOLEAN },
  check_speaker: { type: DataTypes.BOOLEAN },
  check_scenario: { type: DataTypes.BOOLEAN },
  status: { type: DataTypes.INTEGER },
});

const KzCities = sequelize.define("kzcity", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  l_p: { type: DataTypes.INTEGER },
  godzina: { type: DataTypes.STRING },
  os_poj: { type: DataTypes.STRING },
  pary: { type: DataTypes.STRING },
  wyjasnienia: { type: DataTypes.BOOLEAN },
  projekt: { type: DataTypes.STRING },
  miasto_lokal: { type: DataTypes.STRING },
  timezone: { type: DataTypes.INTEGER },
  limit: { type: DataTypes.INTEGER },
  dodawanie_rekordow: { type: DataTypes.STRING },
  scenariusze: { type: DataTypes.STRING },
  weryfikacja_dkj: { type: DataTypes.STRING },
  podpinanie_scenariuszy: { type: DataTypes.STRING },
  present: { type: DataTypes.STRING },
  rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  wb_1: { type: DataTypes.STRING },
  wb_2: { type: DataTypes.INTEGER },
  ilosc_zaproszen: { type: DataTypes.INTEGER },
  dzien_1_data: { type: DataTypes.STRING },
  dzien_1_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  dzien_1_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
  dzien_2_data: { type: DataTypes.STRING },
  dzien_2_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  dzien_2_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
  dzien_3_data: { type: DataTypes.STRING },
  dzien_3_rekodow_na_1_zgode: { type: DataTypes.INTEGER },
  dzien_3_aktualna_ilosc_zaproszen: { type: DataTypes.INTEGER },
  vip_id: { type: DataTypes.STRING },
  vip_format: { type: DataTypes.STRING },
  vip_limit: { type: DataTypes.STRING },
  vip_coming: { type: DataTypes.STRING },
  vip_total_steam: { type: DataTypes.STRING },
  vip_percent_coming: { type: DataTypes.STRING },
  system: { type: DataTypes.STRING },
  zgoda_wyniki_potwierdzen: { type: DataTypes.INTEGER },
  odmowy_wyniki_potwierdzen: { type: DataTypes.INTEGER },
  kropki_wyniki_potwierdzen: { type: DataTypes.INTEGER },
  sms_umawianie: { type: DataTypes.BOOLEAN },
  sms_potwierdzen: { type: DataTypes.BOOLEAN },
  wiretap_note: { type: DataTypes.STRING },
  wiretapping_sogl: { type: DataTypes.STRING },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_stat_4: { type: DataTypes.STRING },
  base_stat_5: { type: DataTypes.STRING },
  id_for_base: { type: DataTypes.INTEGER },
  w_toku: { type: DataTypes.BOOLEAN },
  zamkniete: { type: DataTypes.BOOLEAN },
  base_stat_6: { type: DataTypes.STRING },
  zgody_inne_miasto: { type: DataTypes.INTEGER },
  check_base: { type: DataTypes.BOOLEAN },
  check_speaker: { type: DataTypes.BOOLEAN },
  check_scenario: { type: DataTypes.BOOLEAN },
  status: { type: DataTypes.INTEGER },
});

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
});

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  nickname: { type: DataTypes.STRING, unique: true },
  systemMessage: { type: DataTypes.STRING, defaultValue: "false" },
  checkRu: { type: DataTypes.STRING },
  minimumTransferAmount: { type: DataTypes.INTEGER },
  sumTransferAmoumt: { type: DataTypes.INTEGER },
  completed: { type: DataTypes.INTEGER },
});

module.exports = {
  User,
  Bases,
  Cities,
  KzBases,
  KzCities,
  Formularz,
  Logs,
  LogsForBase,
};
