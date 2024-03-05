const ApiError = require("../../error/ApiError");
const ListService = require("../../services/lists/listService");
const CityService = require("../../services/cityService");
const ListHelper = require("../../utils/listHelper");
const TestJWT = require("./jwt");
const { Op } = require("sequelize");

class ListController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    return res.json(await ListService.getAll(country));
  }

  async getByIds(req, res, next) {
    const { country, ids } = req.body;
    if (!country || !ids[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    ids.map((id) => actions.push({ id }));

    let where = {
      [Op.or]: actions,
    };

    const lists = await ListService.getByWhere(country, where);

    if (!lists) {
      return next(ApiError.internal("Списки не найдены"));
    }
    return res.json({ lists });
  }

  async getByIdsForBase(req, res, next) {
    const { country, idsForBase, pageSize, page, search } = req.body;
    if (!country || !idsForBase[0] || !pageSize || !page) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let actions = [];

    idsForBase.map((id_for_base) => actions.push({ id_for_base }));

    let where = {
      [Op.or]: actions,
      relevance_status: true,
    };

    if (search) {
      where.full_name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const lists = await ListService.getByWhereWithLimit(country, where, pageSize, page);
    const listsForCount = await ListService.getForCount(country, where);
    const count = Math.ceil(listsForCount / pageSize);

    if (!lists) {
      return next(ApiError.internal("Списки не найдены"));
    }
    return res.json({ lists, count });
  }

  async getFilteredLists(req, res, next) {
    const { search, filter, sort, pageSize, page, country } = req.body;
    if (!pageSize || !page || !country) {
      return next(ApiError.badRequest("Укажите Укажите все данные"));
    }

    try {
      const result = await CityService.GetFiltered({
        search,
        filter,
        sort,
        pageSize,
        page,
        country,
      });

      return res.json({ ...result, lists: [] });
    } catch (e) {
      console.log("get filtered lists error:", e);
      return next(ApiError.badRequest("Something get wrong"));
    }
  }

  async create(req, res, next) {
    const { country, id_for_base, tableKey, range } = req.body;
    if (!country || !id_for_base || !tableKey || !range) {
      return next(ApiError.badRequest("Укажите все данные: country, id_for_base, tableKey, range"));
    }
    try {
      let values = await TestJWT.read(tableKey, range);

      values = values.map((item) => ListHelper.convertToList(item));

      const result = await ListService.create({ country, listsArray: values, id_for_base });
      return res.json({ ...result });
    } catch (e) {
      console.log("create lists error:", e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { country, list } = req.body;
    if (!country || !list.id_for_base || !list.id) {
      return next(ApiError.badRequest("Укажите все данные: country, id_for_base, id"));
    }

    const checkListId = await ListService.getById(country, list.id);
    if (!checkListId) {
      return next(ApiError.badRequest("Такого списка нет"));
    }

    const checkCity = await CityService.GetTimeByIdForBase(list.id_for_base, country);
    if (!checkCity) {
      return next(ApiError.badRequest("Такого города нет"));
    }

    try {
      const updatedList = await ListService.update({ country, list });
      global.io.to("1").emit("updateLists", {
        data: { lists: [list], country },
      });
      return res.json("success");
    } catch (e) {
      console.log("update list error", e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async remove(req, res, next) {
    const { ids, country, relevance_status } = req.body;
    if (!country || !ids || !ids[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let idsForDelete = [];
    ids.map((id) => {
      idsForDelete.push({ id });
    });
    let where = {
      [Op.or]: idsForDelete,
    };

    try {
      const deletedList = await ListService.removeByWhere(country, !!relevance_status, where);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new ListController();
