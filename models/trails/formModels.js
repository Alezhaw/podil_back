const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Form = sequelize.define("form", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  local: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
  telephone2: { type: DataTypes.STRING },
  telephone3: { type: DataTypes.STRING },
  telephone4: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  town: { type: DataTypes.STRING },
  voivodeship: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  day: { type: DataTypes.STRING },
  day2: { type: DataTypes.STRING },
  day3: { type: DataTypes.STRING },
  day4: { type: DataTypes.STRING },
  cost: { type: DataTypes.STRING },
  cost2: { type: DataTypes.STRING },
  cost3: { type: DataTypes.STRING },
  cost4: { type: DataTypes.STRING },
  from: { type: DataTypes.STRING },
  from2: { type: DataTypes.STRING },
  from3: { type: DataTypes.STRING },
  from4: { type: DataTypes.STRING },
  to: { type: DataTypes.STRING },
  payment_method: { type: DataTypes.STRING },
  presentation_number: { type: DataTypes.STRING },
  presentation_number2: { type: DataTypes.STRING },
  presentation_number3: { type: DataTypes.STRING },
  presentation_number4: { type: DataTypes.STRING },
  confirm: { type: DataTypes.STRING },
  presentation_time: { type: DataTypes.STRING },
  presentation_time2: { type: DataTypes.STRING },
  presentation_time3: { type: DataTypes.STRING },
  presentation_time4: { type: DataTypes.STRING },
  room_number: { type: DataTypes.STRING },
  room_number2: { type: DataTypes.STRING },
  room_number3: { type: DataTypes.STRING },
  room_number4: { type: DataTypes.STRING },
  parking: { type: DataTypes.STRING },
  comments: { type: DataTypes.STRING },
  booker: { type: DataTypes.STRING },
  starting_price: { type: DataTypes.STRING },
  starting_price2: { type: DataTypes.STRING },
  starting_price3: { type: DataTypes.STRING },
  starting_price4: { type: DataTypes.STRING },
  trade_group: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
});

const KzForm = sequelize.define("kzform", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  local: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
  telephone2: { type: DataTypes.STRING },
  telephone3: { type: DataTypes.STRING },
  telephone4: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  town: { type: DataTypes.STRING },
  voivodeship: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  day: { type: DataTypes.STRING },
  day2: { type: DataTypes.STRING },
  day3: { type: DataTypes.STRING },
  day4: { type: DataTypes.STRING },
  cost: { type: DataTypes.STRING },
  cost2: { type: DataTypes.STRING },
  cost3: { type: DataTypes.STRING },
  cost4: { type: DataTypes.STRING },
  from: { type: DataTypes.STRING },
  from2: { type: DataTypes.STRING },
  from3: { type: DataTypes.STRING },
  from4: { type: DataTypes.STRING },
  to: { type: DataTypes.STRING },
  payment_method: { type: DataTypes.STRING },
  presentation_number: { type: DataTypes.STRING },
  presentation_number2: { type: DataTypes.STRING },
  presentation_number3: { type: DataTypes.STRING },
  presentation_number4: { type: DataTypes.STRING },
  confirm: { type: DataTypes.STRING },
  presentation_time: { type: DataTypes.STRING },
  presentation_time2: { type: DataTypes.STRING },
  presentation_time3: { type: DataTypes.STRING },
  presentation_time4: { type: DataTypes.STRING },
  room_number: { type: DataTypes.STRING },
  room_number2: { type: DataTypes.STRING },
  room_number3: { type: DataTypes.STRING },
  room_number4: { type: DataTypes.STRING },
  parking: { type: DataTypes.STRING },
  comments: { type: DataTypes.STRING },
  booker: { type: DataTypes.STRING },
  starting_price: { type: DataTypes.STRING },
  starting_price2: { type: DataTypes.STRING },
  starting_price3: { type: DataTypes.STRING },
  starting_price4: { type: DataTypes.STRING },
  trade_group: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
});

const PlForm = sequelize.define("plform", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  local: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
  telephone2: { type: DataTypes.STRING },
  telephone3: { type: DataTypes.STRING },
  telephone4: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  town: { type: DataTypes.STRING },
  voivodeship: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  day: { type: DataTypes.STRING },
  day2: { type: DataTypes.STRING },
  day3: { type: DataTypes.STRING },
  day4: { type: DataTypes.STRING },
  cost: { type: DataTypes.STRING },
  cost2: { type: DataTypes.STRING },
  cost3: { type: DataTypes.STRING },
  cost4: { type: DataTypes.STRING },
  from: { type: DataTypes.STRING },
  from2: { type: DataTypes.STRING },
  from3: { type: DataTypes.STRING },
  from4: { type: DataTypes.STRING },
  to: { type: DataTypes.STRING },
  payment_method: { type: DataTypes.STRING },
  presentation_number: { type: DataTypes.STRING },
  presentation_number2: { type: DataTypes.STRING },
  presentation_number3: { type: DataTypes.STRING },
  presentation_number4: { type: DataTypes.STRING },
  confirm: { type: DataTypes.STRING },
  presentation_time: { type: DataTypes.STRING },
  presentation_time2: { type: DataTypes.STRING },
  presentation_time3: { type: DataTypes.STRING },
  presentation_time4: { type: DataTypes.STRING },
  room_number: { type: DataTypes.STRING },
  room_number2: { type: DataTypes.STRING },
  room_number3: { type: DataTypes.STRING },
  room_number4: { type: DataTypes.STRING },
  parking: { type: DataTypes.STRING },
  comments: { type: DataTypes.STRING },
  booker: { type: DataTypes.STRING },
  starting_price: { type: DataTypes.STRING },
  starting_price2: { type: DataTypes.STRING },
  starting_price3: { type: DataTypes.STRING },
  starting_price4: { type: DataTypes.STRING },
  trade_group: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
});

module.exports = {
  Form,
  KzForm,
  PlForm,
};
