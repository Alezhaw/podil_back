const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const SpeakerTemplate = sequelize.define("speaker_template", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING },
  type: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING, unique: true },
  country: { type: DataTypes.STRING },
});
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

const Cities = sequelize.define("city", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  l_p: { type: DataTypes.INTEGER },
  time: { type: DataTypes.TIME },
  coming: { type: DataTypes.STRING },
  couples: { type: DataTypes.STRING },
  explains: { type: DataTypes.BOOLEAN },
  project: { type: DataTypes.STRING },
  city_lokal: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  adress: { type: DataTypes.STRING },
  institution: { type: DataTypes.STRING },
  hall: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY },
  population: { type: DataTypes.INTEGER },
  city_note: { type: DataTypes.STRING },
  calling_scheme: { type: DataTypes.STRING },
  timezone: { type: DataTypes.INTEGER },
  limit: { type: DataTypes.INTEGER },
  time_unlocking_the_city: { type: DataTypes.STRING },
  start_time_ringing: { type: DataTypes.DATE },
  add_scenario: { type: DataTypes.STRING },
  scenario: { type: DataTypes.STRING },
  verification_dkj: { type: DataTypes.STRING },
  undermining_scenariuszy: { type: DataTypes.STRING },
  present: { type: DataTypes.STRING },
  numbers_for_1_consent: { type: DataTypes.INTEGER },
  wb_1: { type: DataTypes.STRING },
  wb_2: { type: DataTypes.INTEGER },
  quantity_invites: { type: DataTypes.INTEGER },
  days_date: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  days_numbers_for_consent: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  days_topical_quantity_invites: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  vip_id: { type: DataTypes.STRING },
  vip_format: { type: DataTypes.STRING },
  vip_limit: { type: DataTypes.STRING },
  vip_coming: { type: DataTypes.STRING },
  vip_total_steam: { type: DataTypes.STRING },
  vip_percent_coming: { type: DataTypes.STRING },
  system: { type: DataTypes.STRING },
  consent_results_confirmation: { type: DataTypes.INTEGER },
  refusal_results_confirmation: { type: DataTypes.INTEGER },
  dots_results_confirmation: { type: DataTypes.INTEGER },
  sms_consent: { type: DataTypes.BOOLEAN },
  sms_confirmation: { type: DataTypes.BOOLEAN },
  wiretap_note: { type: DataTypes.STRING },
  wiretapping_sogl: { type: DataTypes.STRING },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_stat_4: { type: DataTypes.STRING },
  base_stat_5: { type: DataTypes.STRING },
  id_for_base: { type: DataTypes.INTEGER },
  during: { type: DataTypes.BOOLEAN },
  closed: { type: DataTypes.BOOLEAN },
  base_stat_6: { type: DataTypes.STRING },
  consent_another_city: { type: DataTypes.INTEGER },
  check_base: { type: DataTypes.BOOLEAN },
  check_speaker: { type: DataTypes.BOOLEAN },
  check_scenario: { type: DataTypes.BOOLEAN },
  status: { type: DataTypes.INTEGER },
  l_p_for_pl: { type: DataTypes.STRING },
  explains_for_pl: { type: DataTypes.STRING },
});

const KzCities = sequelize.define("kzcity", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  l_p: { type: DataTypes.INTEGER },
  time: { type: DataTypes.TIME },
  coming: { type: DataTypes.STRING },
  couples: { type: DataTypes.STRING },
  explains: { type: DataTypes.BOOLEAN },
  project: { type: DataTypes.STRING },
  city_lokal: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  adress: { type: DataTypes.STRING },
  institution: { type: DataTypes.STRING },
  hall: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY },
  population: { type: DataTypes.INTEGER },
  city_note: { type: DataTypes.STRING },
  calling_scheme: { type: DataTypes.STRING },
  timezone: { type: DataTypes.INTEGER },
  limit: { type: DataTypes.INTEGER },
  time_unlocking_the_city: { type: DataTypes.STRING },
  start_time_ringing: { type: DataTypes.DATE },
  add_scenario: { type: DataTypes.STRING },
  scenario: { type: DataTypes.STRING },
  verification_dkj: { type: DataTypes.STRING },
  undermining_scenariuszy: { type: DataTypes.STRING },
  present: { type: DataTypes.STRING },
  numbers_for_1_consent: { type: DataTypes.INTEGER },
  wb_1: { type: DataTypes.STRING },
  wb_2: { type: DataTypes.INTEGER },
  quantity_invites: { type: DataTypes.INTEGER },
  days_date: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  days_numbers_for_consent: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  days_topical_quantity_invites: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  vip_id: { type: DataTypes.STRING },
  vip_format: { type: DataTypes.STRING },
  vip_limit: { type: DataTypes.STRING },
  vip_coming: { type: DataTypes.STRING },
  vip_total_steam: { type: DataTypes.STRING },
  vip_percent_coming: { type: DataTypes.STRING },
  system: { type: DataTypes.STRING },
  consent_results_confirmation: { type: DataTypes.INTEGER },
  refusal_results_confirmation: { type: DataTypes.INTEGER },
  dots_results_confirmation: { type: DataTypes.INTEGER },
  sms_consent: { type: DataTypes.BOOLEAN },
  sms_confirmation: { type: DataTypes.BOOLEAN },
  wiretap_note: { type: DataTypes.STRING },
  wiretapping_sogl: { type: DataTypes.STRING },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_stat_4: { type: DataTypes.STRING },
  base_stat_5: { type: DataTypes.STRING },
  id_for_base: { type: DataTypes.INTEGER },
  during: { type: DataTypes.BOOLEAN },
  closed: { type: DataTypes.BOOLEAN },
  base_stat_6: { type: DataTypes.STRING },
  consent_another_city: { type: DataTypes.INTEGER },
  check_base: { type: DataTypes.BOOLEAN },
  check_speaker: { type: DataTypes.BOOLEAN },
  check_scenario: { type: DataTypes.BOOLEAN },
  status: { type: DataTypes.INTEGER },
  l_p_for_pl: { type: DataTypes.STRING },
  explains_for_pl: { type: DataTypes.STRING },
});

const PlCities = sequelize.define("plcity", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  l_p: { type: DataTypes.INTEGER },
  time: { type: DataTypes.TIME },
  coming: { type: DataTypes.STRING },
  couples: { type: DataTypes.STRING },
  explains: { type: DataTypes.BOOLEAN },
  project: { type: DataTypes.STRING },
  city_lokal: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  adress: { type: DataTypes.STRING },
  institution: { type: DataTypes.STRING },
  hall: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY },
  population: { type: DataTypes.INTEGER },
  city_note: { type: DataTypes.STRING },
  calling_scheme: { type: DataTypes.STRING },
  timezone: { type: DataTypes.INTEGER },
  limit: { type: DataTypes.INTEGER },
  time_unlocking_the_city: { type: DataTypes.STRING },
  start_time_ringing: { type: DataTypes.DATE },
  add_scenario: { type: DataTypes.STRING },
  scenario: { type: DataTypes.STRING },
  verification_dkj: { type: DataTypes.STRING },
  undermining_scenariuszy: { type: DataTypes.STRING },
  present: { type: DataTypes.STRING },
  numbers_for_1_consent: { type: DataTypes.INTEGER },
  wb_1: { type: DataTypes.STRING },
  wb_2: { type: DataTypes.INTEGER },
  quantity_invites: { type: DataTypes.INTEGER },
  days_date: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  days_numbers_for_consent: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  days_topical_quantity_invites: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  vip_id: { type: DataTypes.STRING },
  vip_format: { type: DataTypes.STRING },
  vip_limit: { type: DataTypes.STRING },
  vip_coming: { type: DataTypes.STRING },
  vip_total_steam: { type: DataTypes.STRING },
  vip_percent_coming: { type: DataTypes.STRING },
  system: { type: DataTypes.STRING },
  consent_results_confirmation: { type: DataTypes.INTEGER },
  refusal_results_confirmation: { type: DataTypes.INTEGER },
  dots_results_confirmation: { type: DataTypes.INTEGER },
  sms_consent: { type: DataTypes.BOOLEAN },
  sms_confirmation: { type: DataTypes.BOOLEAN },
  wiretap_note: { type: DataTypes.STRING },
  wiretapping_sogl: { type: DataTypes.STRING },
  base_stat_1: { type: DataTypes.STRING },
  base_stat_2: { type: DataTypes.STRING },
  base_stat_3: { type: DataTypes.STRING },
  base_stat_4: { type: DataTypes.STRING },
  base_stat_5: { type: DataTypes.STRING },
  id_for_base: { type: DataTypes.INTEGER },
  during: { type: DataTypes.BOOLEAN },
  closed: { type: DataTypes.BOOLEAN },
  base_stat_6: { type: DataTypes.STRING },
  consent_another_city: { type: DataTypes.INTEGER },
  check_base: { type: DataTypes.BOOLEAN },
  check_speaker: { type: DataTypes.BOOLEAN },
  check_scenario: { type: DataTypes.BOOLEAN },
  status: { type: DataTypes.INTEGER },
  l_p_for_pl: { type: DataTypes.STRING },
  explains_for_pl: { type: DataTypes.STRING },
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
  newScript: { type: DataTypes.BOOLEAN },
});

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  nickname: { type: DataTypes.STRING, unique: true },
});

module.exports = {
  User,
  Bases,
  Cities,
  KzBases,
  KzCities,
  PlCities,
  PlBases,
  Formularz,
  Logs,
  LogsForBase,
  SpeakerTemplate,
};
