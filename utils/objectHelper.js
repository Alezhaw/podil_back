//const { Logs } = require("../models/models");
const { Logs } = require("../models/models");

class ObjectHelper {
  constructor() {}

  static getObjectDifferences(obj1, obj2) {
    const differences = [];

    for (let key in obj1) {
      if (!/^\d+$/.test(obj1[key]?.toString())) {
        try {
          let date = new Date(obj1[key]?.toString());

          if (date !== "Invalid Date" && !isNaN(date)) {
            if (!obj2.hasOwnProperty(key) || date.toISOString() != new Date(obj2[key])?.toISOString()) {
              differences.push([key, date.toISOString(), new Date(obj2[key])?.toISOString()]);
            }
            continue;
          }
        } catch (err) {
          console.log(err);
        }
      }

      if (!obj2.hasOwnProperty(key) || obj1[key]?.toString() != obj2[key]?.toString()) {
        differences.push([key, obj1[key]?.toString(), obj2[key]?.toString()]);
      }
    }

    return differences;
  }

  static async sendCityToDatabase(city1, city2, country, action, user) {
    const differences =
      action === "update"
        ? this.getObjectDifferences(city1.dataValues, city2).filter((x) => x[0] != "createdAt" && x[0] != "updatedAt")
        : Object.keys(city1.dataValues)?.map((item) => [item, city1.dataValues[item], null]);
    if (!differences[0]) return console.log("Нет отличий");
    const date = new Date();
    try {
      await Logs.create({
        country,
        action,
        user_id: user.id,
        user_email: user.email,
        differences: JSON.stringify(differences),
        id_for_base: city1.dataValues?.id_for_base,
        godzina: differences.filter((dif) => dif[0] === "godzina")[0] ? null : city1.dataValues?.godzina,
        miasto_lokal: city1.dataValues?.miasto_lokal,
        time: date,
      });

      return true;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = ObjectHelper;
