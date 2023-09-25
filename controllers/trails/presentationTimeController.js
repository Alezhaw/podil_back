const ApiError = require("../../error/ApiError");
const PresentationTimeService = require("../../services/trails/presentationTimeService");

class PresentationTimeController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await PresentationTimeService.getAll(country));
  }

  async create(req, res, next) {
    const { presentationTime, country } = req.body;
    if (!presentationTime || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkPresentationTime = await PresentationTimeService.getByName(country, presentationTime);
    if (checkPresentationTime) {
      return next(ApiError.badRequest("PresentationTime с таким именем уже существует"));
    }
    try {
      const newPresentationTime = await PresentationTimeService.create(country, presentationTime);
      return res.json(newPresentationTime);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { presentationTime, country, id } = req.body;

    if (!presentationTime || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkPresentationTimeName = await PresentationTimeService.getByName(country, presentationTime);
    if (checkPresentationTimeName) {
      return next(ApiError.badRequest("PresentationTime с таким именем уже существует"));
    }
    const checkPresentationTimeId = await PresentationTimeService.getById(country, id);
    if (!checkPresentationTimeId) {
      return next(ApiError.badRequest("PresentationTime с таким id не существует"));
    }
    try {
      const updatedPresentationTime = await PresentationTimeService.update(country, presentationTime, id);
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

    const checkPresentationTimeId = await PresentationTimeService.getById(country, id);
    if (!checkPresentationTimeId) {
      return next(ApiError.badRequest("PresentationTime с таким id не существует"));
    }
    try {
      await PresentationTimeService.delete(country, id);
      return res.json({ ...checkPresentationTimeId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res) {
    const { id, country, relevance_status } = req.body;
    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await CallTemplateService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCallTemplate = await CallTemplateService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new PresentationTimeController();
