const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Formularz } = require("../models/models");

class FormularzController {
  async create(req, res, next) {
    const { data } = req.body;
    const forPostman = [{ ...req.body }];
    console.log(1, forPostman, typeof forPostman, typeof data, req.body);
    if (!data) {
      return next(ApiError.internal("Отправьте данные"));
    }
    let applications = [];
    const result = await Promise.all(
      data.map(async (item, index) => {
        if (item?.kolumna_techniczna) {
          const checkUnique = await Formularz.findOne({ kolumna_techniczna: { kolumna_techniczna: Number(item.kolumna_techniczna) || null } });
          if (checkUnique) {
            try {
              await Formularz.update(item, { where: { kolumna_techniczna: checkUnique.kolumna_techniczna } });
              applications.push(item);
              return;
            } catch (e) {
              return;
            }
          } else {
            const application = await Formularz.create(item);
            applications.push(application.dataValues);
          }
        } else {
          return;
        }
      })
    );
    const allApplications = await Formularz.findAll();

    const removedApplications = allApplications.filter((el) => !data.map((item) => item.kolumna_techniczna).includes(el.kolumna_techniczna));
    console.log(2, removedApplications?.slice(0, 5));
    if (removedApplications[0]) {
      console.log(
        3,
        data
          .map((item) => item.kolumna_techniczna)
          .includes(removedApplications[0].kolumna_techniczna)
          ?.slice(0, 5)
      );
      const statusRemoved = await Promise.all(
        removedApplications.map(async (el) => {
          try {
            await Formularz.update({ statusForDatabase: 0 }, { where: { kolumna_techniczna: el.kolumna_techniczna } });
            return;
          } catch (e) {
            return;
          }
        })
      );
    }

    return res.json({
      applications,
      removedApplications,
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
