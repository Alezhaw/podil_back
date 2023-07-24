const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Formularz } = require("../models/models");
const { Cities } = require("../models/models");

class FormularzController {
  async create(req, res, next) {
    let user = req.user;
    const { data } = req.body;
    let updated = "";
    let not_id_for_base = "";
    let error = [];
    let cities = [];
    let citiesForWebSocket = [];
    const forPostman = [{ ...req.body }];
    const result = await Promise.all(
      data.map(async (item, index) => {
        if (!item.id_for_base) {
          const cities = await Cities.findAll();
          const lastIdForBase = cities?.reduce((sum, el) => (Number(el.id_for_base) > sum ? Number(el.id_for_base) : sum), 0);
          //not_id_for_base = `${not_id_for_base}/${item.miasto_lokal}`;
          item.id_for_base = Number(lastIdForBase) + 4;
        }
        if (item?.id !== "create") {
          const checkUnique = (await Cities.findOne({ where: { id: Number(item.id) || null } })) || (await Cities.findOne({ where: { id_for_base: item.id_for_base, godzina: item.godzina } }));

          if (checkUnique) {
            try {
              const result = ObjectHelper.sendDifferencesToDatabase(checkUnique, item, "russia", "update", user, "city");
              if (!result) {
                error.push({
                  miasto: item.miasto_lokal,
                  id_for_base: item.id_for_base,
                  error: "Failed to write log",
                });
                return;
              }
              await Cities.update(item, { where: { id: checkUnique.id } });
              updated = `${updated}/${item.id_for_base}`;
              citiesForWebSocket.push(item);
              return;
            } catch (e) {
              return error.push({
                miasto: item.miasto_lokal,
                id_for_base: item.id_for_base,
                error: e.message,
              });
            }
          }
        }
        try {
          delete item.id;
          const city = await Cities.create(item);
          cities.push(city.dataValues);
          citiesForWebSocket.push(city.dataValues);
          const result = ObjectHelper.sendDifferencesToDatabase(city, item, "russia", "create", user, "city");
          if (!result) {
            error.push({
              miasto: item.miasto_lokal,
              id_for_base: item.id_for_base,
              error: "Failed to write log",
            });
          }
        } catch (e) {
          return error.push({
            miasto: item.miasto_lokal,
            id_for_base: item.id_for_base,
            error: e.message,
          });
        }
      })
    );

    if (citiesForWebSocket[0]) {
      global.io.to("1").emit("updateCitiesRu", {
        data: { cities: citiesForWebSocket },
      });
    }

    return res.json({
      cities,
      updated,
      not_id_for_base,
      error,
    });
  }

  async getAll(req, res) {
    const applications = await Formularz.findAll();
    return res.json(applications);
  }

  async getActiveApplications(req, res) {
    const applications = await Formularz.findAll();
    const activeApplications = applications?.filter((el) => el.statusForDatabase === 1);
    return res.json(activeApplications);
  }

  async getInvalidApplications(req, res) {
    const applications = await Formularz.findAll();
    const invalidApplications = applications?.filter((el) => el.statusForDatabase === 0);
    return res.json(invalidApplications);
  }

  //   async deleteBase(req, res, next) {
  //     const { id, base_id } = req.body;
  //     let user = req.user;
  //     if (!id && !base_id) {
  //       return next(ApiError.badRequest("Укажите id или base_id"));
  //     }
  //     const base = (await Bases.findOne({ where: { id: Number(id) || null } })) || (await Bases.findOne({ where: { base_id: base_id } }));
  //     if (!base) {
  //       return next(ApiError.internal("База не найдена"));
  //     }
  //     const result = ObjectHelper.sendDifferencesToDatabase(base, base.dataValues, "russia", "delete", user, "base");
  //     if (!result) {
  //       return next(ApiError.internal("Failed to write log"));
  //     }

  //     await Bases.destroy({
  //       where: { id: base.id },
  //     });

  //     global.io.to("1").emit("deleteBaseRu", {
  //       data: { deleteBase: base.id },
  //     });

  //     return res.json({ ...base.dataValues });
  //   }
}

module.exports = new FormularzController();
