const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { KzBases } = require("../models/models");
const { KzCities } = require("../models/models");

class BasesController {
  async create(req, res, next) {
    const { data } = req.body;
    let user = req.user;
    let update = "";
    let notIdForBase = "";
    let error = [];
    let bases = [];
    let basesForWebSocket = [];
    const forPostman = [{ ...req.body }];
    console.log(1, data, req.body);
    const result = await Promise.all(
      data.map(async (item, index) => {
        const checkUnique = (await KzBases.findOne({ where: { id: Number(item.id) || null } })) || (await KzBases.findOne({ where: { base_id: item.base_id } }));
        if (checkUnique) {
          try {
            const result = ObjectHelper.sendDifferencesToDatabase(checkUnique, item, "kazakhstan", "update", user, "base");
            if (!result) {
              error.push({
                base_id: item.base_id,
                error: "Failed to write log",
              });
            }
            await KzBases.update(
              {
                id_for_base: Number(item.id_for_base),
                base_id: item.base_id || null,
                base_stat_1: item.base_stat_1 || null,
                base_stat_2: item.base_stat_2 || null,
                base_stat_3: item.base_stat_3 || null,
                base_type: item.base_type || null,
                base_sort: item.base_sort || null,
                base_sogl_1: Number(item.base_sogl_1) || null,
                base_sogl_2: Number(item.base_sogl_2) || null,
                base_sogl_3: Number(item.base_sogl_3) || null,
                base_comment: item.base_comment || null,
              },
              { where: { id: checkUnique.id } }
            );
            basesForWebSocket.push(item);
            update = `${update}/${item.base_id}`;
            return;
          } catch (e) {
            return error.push({
              base_id: item.base_id,
              error: e.message,
            });
          }
        }
        if (!item.id_for_base) {
          notIdForBase = `${notIdForBase}/${item.base_id}`;
          return;
        }
        try {
          const base = await KzBases.create({
            id_for_base: Number(item.id_for_base),
            base_id: item.base_id || null,
            base_stat_1: item.base_stat_1 || null,
            base_stat_2: item.base_stat_2 || null,
            base_stat_3: item.base_stat_3 || null,
            base_type: item.base_type || null,
            base_sort: item.base_sort || null,
            base_sogl_1: Number(item.base_sogl_1) || null,
            base_sogl_2: Number(item.base_sogl_2) || null,
            base_sogl_3: Number(item.base_sogl_3) || null,
            base_comment: item.base_comment || null,
          });
          bases.push(base.dataValues);
          basesForWebSocket.push(base.dataValues);
          const result = ObjectHelper.sendDifferencesToDatabase(base, item, "kazakhstan", "create", user, "base");
          if (!result) {
            error.push({
              base_id: item.base_id,
              error: "Failed to write log",
            });
          }
        } catch (e) {
          return error.push({
            base_id: item.base_id,
            error: e.message,
          });
        }
      })
    );

    if (basesForWebSocket[0]) {
      global.io.to("1").emit("updateBasesKz", {
        data: { bases: basesForWebSocket },
      });
    }

    return res.json({
      bases,
      update,
      notIdForBase,
      error,
    });
  }

  async getAll(req, res) {
    const bases = await KzBases.findAll();
    return res.json(bases);
  }

  async getOneBase(req, res, next) {
    const { id, base_id } = req.body;

    if (!id && !base_id) {
      return next(ApiError.badRequest("Укажите id или base_id"));
    }
    const base = (await KzBases.findOne({ where: { id: Number(id) || 0 } })) || (await KzBases.findOne({ where: { base_id: base_id } }));
    if (!base) {
      return next(ApiError.internal("База не найдена"));
    }
    return res.json(base);
  }

  async getBasesForCity(req, res, next) {
    const { id_for_base } = req.body;

    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    const bases = await KzBases.findAll({ where: { id_for_base: Number(id_for_base) } });
    if (!bases) {
      return next(ApiError.internal("Базы не найдены"));
    }
    return res.json(bases);
  }

  async getFilteredBases(req, res, next) {
    const { search } = req.body;

    if (!search) {
      return next(ApiError.badRequest("Укажите запрос"));
    }
    const city = await KzCities.findAll();
    if (!city) {
      return next(ApiError.internal("Нет городов в базе данных"));
    }

    const filteredCities = city
      ?.filter((el) => (search ? el?.miasto_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.id_for_base).indexOf(item.id_for_base) === i;
      })
      ?.map((el) => el.id_for_base);
    const allBases = await KzBases.findAll();
    let bases = filteredCities?.map((cityBaseId) => allBases.filter((base) => base.id_for_base === cityBaseId))?.flat();
    bases = bases[0] ? bases : allBases.filter((base) => String(base.base_id).toLowerCase().includes(String(search).toLowerCase()));
    bases = bases?.map((base) => ({ ...(base.dataValues || base), miasto_lokal: city?.filter((oneCity) => Number(oneCity.id_for_base) === Number(base.id_for_base))[0]?.miasto_lokal }));

    return res.json(bases);
  }

  async deleteBase(req, res, next) {
    const { id, base_id } = req.body;
    let user = req.user;
    if (!id && !base_id) {
      return next(ApiError.badRequest("Укажите id или base_id"));
    }
    const base = (await KzBases.findOne({ where: { id: Number(id) || null } })) || (await KzBases.findOne({ where: { base_id: base_id } }));
    if (!base) {
      return next(ApiError.internal("База не найдена"));
    }
    const result = ObjectHelper.sendDifferencesToDatabase(base, base.dataValues, "kazakhstan", "delete", user, "base");
    if (!result) {
      return next(ApiError.internal("Failed to write log"));
    }

    await KzBases.destroy({
      where: { id: base.id },
    });

    global.io.to("1").emit("deleteBaseKz", {
      data: { deleteBase: base.id },
    });

    return res.json({ ...base.dataValues });
  }
}

module.exports = new BasesController();
