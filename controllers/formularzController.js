const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { Formularz } = require("../models/formularzModels");

class FormularzController {
  async create(req, res, next) {
    const { data } = req.body;
    console.log(1, data);
    const forPostman = [{ ...req.body }];
    if (!data) {
      return next(ApiError.internal("Отправьте данные"));
    }
    let applications = [];
    const result = await Promise.all(
      data.map(async (item, index) => {
        if (item?.kolumna_techniczna) {
          const checkUnique = await Formularz.findOne({ where: { kolumna_techniczna: Number(item.kolumna_techniczna) || null } });
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

    const newScriptApplications = allApplications.filter((el) => el.dataValues.newScript).map((el) => el?.dataValues?.kolumna_techniczna);
    const removedApplications = allApplications.filter((el) => !newScriptApplications.includes(el.dataValues.kolumna_techniczna))?.map((item) => item.dataValues);
    if (removedApplications[0]) {
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

  async updateNewScriptParametr(req, res) {
    await Formularz.update({ newScript: false }, { where: {} });
    return res.json("Success");
  }

  async deleteAll(req, res) {
    await Formularz.destroy({
      where: {},
    });
    return res.json("Success");
  }
}

module.exports = new FormularzController();
