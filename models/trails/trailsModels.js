const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Trails = sequelize.define("trail", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  planning_person_id: { type: DataTypes.INTEGER },
  date_scheduled: { type: DataTypes.DATEONLY },
  company_id: { type: DataTypes.INTEGER }, // объект в бд называется regiments
  route_number: { type: DataTypes.INTEGER },
  departure_dates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  presentation_date: { type: DataTypes.DATEONLY },
  presentation_time_id: { type: DataTypes.INTEGER },
  regionId: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  form_id: { type: DataTypes.INTEGER },
  reservation_status_id: { type: DataTypes.INTEGER },
  alternative: { type: DataTypes.STRING },
  contract_status_id: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.STRING },
  sent_to_podil: { type: DataTypes.BOOLEAN },
  sent_to_bases: { type: DataTypes.BOOLEAN },
  sent_to_speaker: { type: DataTypes.BOOLEAN },
  sent_to_scenario: { type: DataTypes.BOOLEAN },
  autozonning: { type: DataTypes.STRING },
  date_of_the_previous_presentation: { type: DataTypes.DATEONLY },
  project_sales_id: { type: DataTypes.INTEGER },
  project_concent_id: { type: DataTypes.INTEGER },
  call_template_id: { type: DataTypes.INTEGER },
});

const KzTrails = sequelize.define("kstrail", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  planning_person_id: { type: DataTypes.INTEGER },
  date_scheduled: { type: DataTypes.DATEONLY },
  company_id: { type: DataTypes.INTEGER }, // объект в бд называется regiments
  route_number: { type: DataTypes.INTEGER },
  departure_dates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  presentation_date: { type: DataTypes.DATEONLY },
  presentation_time_id: { type: DataTypes.INTEGER },
  regionId: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  form_id: { type: DataTypes.INTEGER },
  reservation_status_id: { type: DataTypes.INTEGER },
  alternative: { type: DataTypes.STRING },
  contract_status_id: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.STRING },
  sent_to_podil: { type: DataTypes.BOOLEAN },
  sent_to_bases: { type: DataTypes.BOOLEAN },
  sent_to_speaker: { type: DataTypes.BOOLEAN },
  sent_to_scenario: { type: DataTypes.BOOLEAN },
  autozonning: { type: DataTypes.STRING },
  date_of_the_previous_presentation: { type: DataTypes.DATEONLY },
  project_sales_id: { type: DataTypes.INTEGER },
  project_concent_id: { type: DataTypes.INTEGER },
  call_template_id: { type: DataTypes.INTEGER },
});

const PlTrails = sequelize.define("pltrail", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  planning_person_id: { type: DataTypes.INTEGER },
  date_scheduled: { type: DataTypes.DATEONLY },
  company_id: { type: DataTypes.INTEGER }, // объект в бд называется regiments
  route_number: { type: DataTypes.INTEGER },
  departure_dates: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  presentation_date: { type: DataTypes.DATEONLY },
  presentation_time_id: { type: DataTypes.INTEGER },
  regionId: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  form_id: { type: DataTypes.INTEGER },
  reservation_status_id: { type: DataTypes.INTEGER },
  alternative: { type: DataTypes.STRING },
  contract_status_id: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.STRING },
  sent_to_podil: { type: DataTypes.BOOLEAN },
  sent_to_bases: { type: DataTypes.BOOLEAN },
  sent_to_speaker: { type: DataTypes.BOOLEAN },
  sent_to_scenario: { type: DataTypes.BOOLEAN },
  autozonning: { type: DataTypes.STRING },
  date_of_the_previous_presentation: { type: DataTypes.DATEONLY },
  project_sales_id: { type: DataTypes.INTEGER },
  project_concent_id: { type: DataTypes.INTEGER },
  call_template_id: { type: DataTypes.INTEGER },
});

module.exports = {
  Trails,
  KzTrails,
  PlTrails,
};
