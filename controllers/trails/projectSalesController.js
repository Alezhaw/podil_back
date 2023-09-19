const ApiError = require("../../error/ApiError");
const ProjectSalesService = require("../../services/trails/projectSalesService");

class ProjectSalesController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await ProjectSalesService.getAll(country));
  }

  async create(req, res, next) {
    const { projectSales, country } = req.body;
    if (!projectSales || !country) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkProjectSales = await ProjectSalesService.getByName(country, projectSales);
    if (checkProjectSales) {
      return next(ApiError.badRequest("ProjectSales с таким именем уже существует"));
    }
    try {
      const newProjectSales = await ProjectSalesService.create(country, projectSales);
      return res.json(newProjectSales);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { projectSales, country, id } = req.body;

    if (!projectSales || !country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    const checkProjectSalesName = await ProjectSalesService.getByName(country, projectSales);
    if (checkProjectSalesName) {
      return next(ApiError.badRequest("ProjectSales с таким именем уже существует"));
    }
    const checkProjectSalesId = await ProjectSalesService.getById(country, id);
    if (!checkProjectSalesId) {
      return next(ApiError.badRequest("ProjectSales с таким id не существует"));
    }
    try {
      const updatedProjectSales = await ProjectSalesService.update(country, projectSales, id);
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

    const checkProjectSalesId = await ProjectSalesService.getById(country, id);
    if (!checkProjectSalesId) {
      return next(ApiError.badRequest("ProjectSales с таким id не существует"));
    }
    try {
      await ProjectSalesService.delete(country, id);
      return res.json({ ...checkProjectSalesId.dataValues });
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new ProjectSalesController();
