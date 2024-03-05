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
  limits: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  regionId: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  form_id: { type: DataTypes.INTEGER },
  reservation_status_id: { type: DataTypes.INTEGER },
  alternative: { type: DataTypes.STRING },
  landmarks: { type: DataTypes.STRING },
  contract_status_id: { type: DataTypes.INTEGER },
  contract_comment: { type: DataTypes.STRING },
  comment: { type: DataTypes.STRING },
  sent_to_podil: { type: DataTypes.BOOLEAN },
  sent_to_bases: { type: DataTypes.BOOLEAN },
  sent_to_speaker: { type: DataTypes.BOOLEAN },
  sent_to_scenario: { type: DataTypes.BOOLEAN },
  autozonning: { type: DataTypes.STRING },
  regionalization_comment: { type: DataTypes.STRING },
  date_of_the_previous_presentation: { type: DataTypes.DATEONLY },
  project_sales_id: { type: DataTypes.INTEGER },
  project_concent_id: { type: DataTypes.INTEGER },
  call_template_id: { type: DataTypes.INTEGER },
  relevance_status: { type: DataTypes.BOOLEAN },
  departure_id: { type: DataTypes.INTEGER },
  departure_date_id: { type: DataTypes.INTEGER },
  gazooServerId: { type: DataTypes.STRING },
  gazooCampaignId: { type: DataTypes.INTEGER },
  stopped: { type: DataTypes.BOOLEAN },
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
  limits: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  regionId: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  form_id: { type: DataTypes.INTEGER },
  reservation_status_id: { type: DataTypes.INTEGER },
  alternative: { type: DataTypes.STRING },
  landmarks: { type: DataTypes.STRING },
  contract_status_id: { type: DataTypes.INTEGER },
  contract_comment: { type: DataTypes.STRING },
  comment: { type: DataTypes.STRING },
  sent_to_podil: { type: DataTypes.BOOLEAN },
  sent_to_bases: { type: DataTypes.BOOLEAN },
  sent_to_speaker: { type: DataTypes.BOOLEAN },
  sent_to_scenario: { type: DataTypes.BOOLEAN },
  autozonning: { type: DataTypes.STRING },
  regionalization_comment: { type: DataTypes.STRING },
  date_of_the_previous_presentation: { type: DataTypes.DATEONLY },
  project_sales_id: { type: DataTypes.INTEGER },
  project_concent_id: { type: DataTypes.INTEGER },
  call_template_id: { type: DataTypes.INTEGER },
  relevance_status: { type: DataTypes.BOOLEAN },
  departure_id: { type: DataTypes.INTEGER },
  departure_date_id: { type: DataTypes.INTEGER },
  gazooServerId: { type: DataTypes.STRING },
  gazooCampaignId: { type: DataTypes.INTEGER },
  stopped: { type: DataTypes.BOOLEAN },
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
  limits: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
  regionId: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  form_id: { type: DataTypes.INTEGER },
  reservation_status_id: { type: DataTypes.INTEGER },
  alternative: { type: DataTypes.STRING },
  landmarks: { type: DataTypes.STRING },
  contract_status_id: { type: DataTypes.INTEGER },
  contract_comment: { type: DataTypes.STRING },
  comment: { type: DataTypes.STRING },
  sent_to_podil: { type: DataTypes.BOOLEAN },
  sent_to_bases: { type: DataTypes.BOOLEAN },
  sent_to_speaker: { type: DataTypes.BOOLEAN },
  sent_to_scenario: { type: DataTypes.BOOLEAN },
  autozonning: { type: DataTypes.STRING },
  regionalization_comment: { type: DataTypes.STRING },
  date_of_the_previous_presentation: { type: DataTypes.DATEONLY },
  project_sales_id: { type: DataTypes.INTEGER },
  project_concent_id: { type: DataTypes.INTEGER },
  call_template_id: { type: DataTypes.INTEGER },
  relevance_status: { type: DataTypes.BOOLEAN },
  departure_id: { type: DataTypes.INTEGER },
  departure_date_id: { type: DataTypes.INTEGER },
  gazooServerId: { type: DataTypes.STRING },
  gazooCampaignId: { type: DataTypes.INTEGER },
  stopped: { type: DataTypes.BOOLEAN },
});

const CitiesWithReg = sequelize.define(
  "cities_with_region",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    region_id: { type: DataTypes.INTEGER },
    city_name: { type: DataTypes.STRING },
    additional_city_name: { type: DataTypes.STRING },
    county: { type: DataTypes.STRING },
    city_type: { type: DataTypes.STRING },
    population: { type: DataTypes.INTEGER },
    autozonning: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    start_coord: { type: DataTypes.DOUBLE },
    end_coord: { type: DataTypes.DOUBLE },
    relevance_status: { type: DataTypes.BOOLEAN },
  },
  { indexes: [{ unique: true, fields: ["region_id", "city_name", "relevance_status"] }] }
);

const KzCitiesWithReg = sequelize.define(
  "kzcities_with_region",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    region_id: { type: DataTypes.INTEGER },
    city_name: { type: DataTypes.STRING },
    additional_city_name: { type: DataTypes.STRING },
    county: { type: DataTypes.STRING },
    city_type: { type: DataTypes.STRING },
    population: { type: DataTypes.INTEGER },
    autozonning: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    start_coord: { type: DataTypes.DOUBLE },
    end_coord: { type: DataTypes.DOUBLE },
    relevance_status: { type: DataTypes.BOOLEAN },
  },
  { indexes: [{ unique: true, fields: ["region_id", "city_name", "relevance_status"] }] }
);

const PlCitiesWithReg = sequelize.define(
  "plcities_with_region",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    region_id: { type: DataTypes.INTEGER },
    city_name: { type: DataTypes.STRING },
    additional_city_name: { type: DataTypes.STRING },
    county: { type: DataTypes.STRING },
    city_type: { type: DataTypes.STRING },
    population: { type: DataTypes.INTEGER },
    autozonning: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    start_coord: { type: DataTypes.DOUBLE },
    end_coord: { type: DataTypes.DOUBLE },
    relevance_status: { type: DataTypes.BOOLEAN },
  },
  { indexes: [{ unique: true, fields: ["region_id", "city_name", "relevance_status"] }] }
);

CitiesWithReg.hasOne(Trails, {
  foreignKey: "city_id",
});
Trails.belongsTo(CitiesWithReg, {
  foreignKey: "city_id",
});

KzCitiesWithReg.hasOne(KzTrails, {
  foreignKey: "city_id",
});
KzTrails.belongsTo(KzCitiesWithReg, {
  foreignKey: "city_id",
});

PlCitiesWithReg.hasOne(PlTrails, {
  foreignKey: "city_id",
});
PlTrails.belongsTo(PlCitiesWithReg, {
  foreignKey: "city_id",
});

module.exports = {
  Trails,
  KzTrails,
  PlTrails,
  CitiesWithReg,
  KzCitiesWithReg,
  PlCitiesWithReg,
};
