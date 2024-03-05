const ApiError = require("../error/ApiError");
const { CreateCompanyQueue } = require("../models/createCompanyQueueModels");

class CreateCompanyQueueController {
  async getAll(req, res) {
    const companyQueue = await CreateCompanyQueue.findAll();
    return res.json(companyQueue);
  }

  async create(req, res, next) {
    const { data } = req.body;

    if (!data) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkCompanyQueue = await CreateCompanyQueue.findOne({ where: { ...data } });
    if (checkCompanyQueue) {
      return next(ApiError.badRequest("Компания уже есть в очереди"));
    }
    try {
      const companyQueue = await CreateCompanyQueue.create({ ...data });
      return res.json(companyQueue);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { companyQueue } = req.body;

    if (!companyQueue || !companyQueue?.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkCompanyQueue = await CreateCompanyQueue.findOne({ where: { ...data } });
    if (checkCompanyQueue) {
      return next(ApiError.badRequest("Компания уже есть в очереди"));
    }
    const checkCompanyQueueId = await CreateCompanyQueue.findOne({ where: { id } });
    if (!checkCompanyQueueId) {
      return next(ApiError.badRequest("Компании с таким id не существует"));
    }
    try {
      const result = await CreateCompanyQueue.update({ ...companyQueue }, { where: { id } });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async delete(req, res, next) {
    const { id } = req.body;

    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }

    const checkCompanyQueueId = await CreateCompanyQueue.findOne({ where: { id } });
    if (!checkCompanyQueueId) {
      return next(ApiError.badRequest("Компании с таким id не существует"));
    }
    try {
      await CreateCompanyQueue.destroy({
        where: { id },
      });
      return res.json({ ...checkCompanyQueueId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new CreateCompanyQueueController();
