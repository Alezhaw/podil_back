const ApiError = require("../error/ApiError");
const { ServersQueue } = require("../models/serversQueueModels");

class ServersQueueController {
  async getAll(req, res) {
    const serversQueue = await ServersQueue.findAll();
    return res.json(serversQueue);
  }

  async getByCountry(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    const serversQueue = await ServersQueue.findAll({ where: { country } });
    if (!serversQueue[0]) {
      return next(ApiError.badRequest("Очередь пуста"));
    }
    return res.json(serversQueue);
  }

  async create(req, res, next) {
    const { data } = req.body;

    if (!data?.country || !data?.url) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkServersQueue = await ServersQueue.findOne({ where: { country: data?.country, url: data?.url } });
    if (checkServersQueue) {
      return next(ApiError.badRequest("Сервер уже есть в очереди"));
    }
    try {
      const serversQueue = await ServersQueue.create({ ...data });
      return res.json(serversQueue);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async increaseCompanyCount(req, res, next) {
    const { id, count, url, country, name } = req.body;
    if (!count || (!id && !url && !country && !name)) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkServersQueue = id ? await ServersQueue.findOne({ where: { id } }) : await ServersQueue.findOne({ where: { url, country } });
    if (!checkServersQueue) {
      try {
        const serversQueue = await ServersQueue.create({ url, country, name, companyCount: count });
        return res.json(serversQueue);
      } catch (e) {
        console.log(2, "Непредвиденная ошибка", e);
        return next(ApiError.badRequest("Непредвиденная ошибка"));
      }
    }
    try {
      const result = await ServersQueue.update({ companyCount: checkServersQueue?.dataValues?.companyCount + count }, { where: { id: checkServersQueue?.dataValues?.id } });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { serversQueue } = req.body;

    if (!serversQueue || !serversQueue?.id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkServersQueue = await ServersQueue.findOne({ where: { country: data?.country, url: data?.url, companyCount: data?.companyCount } });
    if (checkServersQueue) {
      return next(ApiError.badRequest("Сервер уже есть в очереди"));
    }
    const checkServersQueueId = await ServersQueue.findOne({ where: { id } });
    if (!checkServersQueueId) {
      return next(ApiError.badRequest("Сервер с таким id не существует"));
    }
    try {
      const result = await ServersQueue.update({ ...serversQueue }, { where: { id } });
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

    const checkServersQueueId = await ServersQueue.findOne({ where: { id } });
    if (!checkServersQueueId) {
      return next(ApiError.badRequest("Сервер с таким id не существует"));
    }
    try {
      await ServersQueue.destroy({
        where: { id },
      });
      return res.json({ ...checkServersQueueId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async deleteAll() {
    try {
      await ServersQueue.destroy({ where: {} });
      console.log("Servers queue cleared");
    } catch (e) {
      console.log("Servers queue cleared error", e);
    }
  }
}

module.exports = new ServersQueueController();
