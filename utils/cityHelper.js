function change(time, restore) {
  const timeArray = String(time).split(":");
  if (restore) {
    if (timeArray.length !== 2) {
      return time;
    } else {
      return `${time}:00`;
    }
  } else {
    if (timeArray.length !== 3) {
      return time;
    } else {
      return [timeArray[0], timeArray[1]].join(":");
    }
  }
}

class CityHelper {
  constructor() {}

  static changeCitiesTime(cities, restore) {
    if (!cities || !cities[0]) {
      return [];
    }

    return cities.map((item) => {
      if (item.dataValues) {
        item = item.dataValues;
      }
      item = { ...item, time: change(item.time, restore) };
      return item;
    });
  }
}

module.exports = CityHelper;
