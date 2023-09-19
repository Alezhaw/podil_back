const ApiError = require("../../error/ApiError");
const ContactStatusService = require("../../services/trails/contactStatusService");

class ContactStatusController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await ContactStatusService.getAll(country));
  }

  async create(req, res, next) {
    const { contactStatus, country } = req.body;
    if (!contactStatus || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkContactStatus = await ContactStatusService.getByName(country, contactStatus);
    if (checkContactStatus) {
      return next(ApiError.badRequest("ContactStatus с таким именем уже существует"));
    }
    try {
      const newContactStatus = await ContactStatusService.create(country, contactStatus);
      return res.json(newContactStatus);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { contactStatus, country, id } = req.body;

    if (!contactStatus || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkContactStatusName = await ContactStatusService.getByName(country, contactStatus);
    if (checkContactStatusName) {
      return next(ApiError.badRequest("ContactStatus с таким именем уже существует"));
    }
    const checkContactStatusId = await ContactStatusService.getById(country, id);
    if (!checkContactStatusId) {
      return next(ApiError.badRequest("ContactStatus с таким id не существует"));
    }
    try {
      const updatedContactStatus = await ContactStatusService.update(country, contactStatus, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async delete(req, res, next) {
    const { country, id } = req.body;

    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkContactStatusId = await ContactStatusService.getById(country, id);
    if (!checkContactStatusId) {
      return next(ApiError.badRequest("ContactStatus с таким id не существует"));
    }
    try {
      await ContactStatusService.delete(country, id);
      return res.json({ ...checkContactStatusId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new ContactStatusController();
