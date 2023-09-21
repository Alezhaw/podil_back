const ApiError = require("../../error/ApiError");
const TrailsService = require("../../services/trails/trailsService");
const PlanningPersonService = require("../../services/trails/planningPersonService");
const RegimentService = require("../../services/trails/regimentService");
const PresentationTimeService = require("../../services/trails/presentationTimeService");
const RegionService = require("../../services/trails/regionService");
const CitiesWithRegService = require("../../services/trails/citiesWithRegionsService");
const FormService = require("../../services/trails/formService");
const ReservationStatusService = require("../../services/trails/reservationStatusService");
const ContactStatusService = require("../../services/trails/contactStatusService");
const ProjectSalesService = require("../../services/trails/projectSalesService");
const ProjectConcentService = require("../../services/trails/projectConcentService");
const CallTemplateService = require("../../services/trails/callTemplatesService");

class TrailsController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await TrailsService.getAll(country));
  }

  async create(req, res, next) {
    const { country, trail } = req.body;
    if (!country || !trail || !trail.planning_person_id || !trail.date_scheduled || !trail.presentation_date || !trail.contract_status_id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    if (trail.id) {
      return next(ApiError.badRequest("Презентация уже есть"));
    }

    const checkPlanningPerson = await PlanningPersonService.getById(country, trail.planning_person_id);
    if (!checkPlanningPerson) {
      throw ApiError.internal("Planning person не найден");
    }
    const checkContractStatus = await ContactStatusService.getById(country, trail.contract_status_id);
    if (!checkContractStatus) {
      throw ApiError.internal("Статус не найден");
    }
    // if (!trail.regionId) {
    //   return next(ApiError.badRequest("Укажите область"));
    // }
    // if (!trail.city_id) {
    //   return next(ApiError.badRequest("Укажите город"));
    // }

    try {
      const newTrail = await TrailsService.create({ country, trail });
      return res.json(newTrail);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { country, trail } = req.body;
    if (!country || !trail || !trail.planning_person_id || !trail.date_scheduled || !trail.presentation_date || !trail.contract_status_id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const checkTrail = await TrailsService.getById(country, trail.id);
    if (!checkTrail) {
      return next(ApiError.badRequest("Презентации с таким id не существует"));
    }
    const checkPlanningPerson = await PlanningPersonService.getById(country, trail.planning_person_id);
    if (!checkPlanningPerson) {
      throw ApiError.internal("Planning person не найден");
    }
    const checkContractStatus = await ContactStatusService.getById(country, trail.contract_status_id);
    if (!checkContractStatus) {
      throw ApiError.internal("Статус не найден");
    }
    if (trail.company_id) {
      const checkCompany = await RegimentService.getById(country, trail.company_id);
      if (!checkCompany) {
        throw ApiError.internal("Company не найдена");
      }
    }
    if (trail.presentation_time_id) {
      const checkPresentationTime = await PresentationTimeService.getById(country, trail.presentation_time_id);
      if (!checkPresentationTime) {
        throw ApiError.internal("Presentation time не найден");
      }
    }
    if (trail.regionId) {
      const checkRegion = await RegionService.getById(country, trail.regionId);
      if (!checkRegion) {
        throw ApiError.internal("Область не найдена");
      }
    }
    if (trail.city_id) {
      const checkCity = await CitiesWithRegService.getById(country, trail.city_id);
      if (!checkCity) {
        throw ApiError.internal("Город не найден");
      }
    }
    if (trail.form_id) {
      const checkForm = await FormService.getById(country, trail.form_id);
      if (!checkForm) {
        throw ApiError.internal("Город не найден");
      }
    }
    if (trail.reservation_status_id) {
      const checkReservationStatus = await ReservationStatusService.getById(country, trail.reservation_status_id);
      if (!checkReservationStatus) {
        throw ApiError.internal("Статус резервирования не найден");
      }
    }
    if (trail.project_sales_id) {
      const checkProjectSales = await ProjectSalesService.getById(country, trail.project_sales_id);
      if (!checkProjectSales) {
        throw ApiError.internal("Project sales не найден");
      }
    }
    if (trail.project_concent_id) {
      const checkProjectConcent = await ProjectConcentService.getById(country, trail.project_concent_id);
      if (!checkProjectConcent) {
        throw ApiError.internal("Project concent не найден");
      }
    }
    if (trail.call_template_id) {
      const checkCallTemplate = await CallTemplateService.getById(country, trail.call_template_id);
      if (!checkProjectConcent) {
        throw ApiError.internal("Call template не найден");
      }
    }
    // if (!trail.regionId) {
    //   return next(ApiError.badRequest("Укажите область"));
    // }
    // if (!trail.city_id) {
    //   return next(ApiError.badRequest("Укажите город"));
    // }

    try {
      const updatedTrail = await TrailsService.update({ country, trail });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getFiltered(req, res, next) {
    const { search, dateTo, dateFrom, sort, pageSize, page, country } = req.body;

    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }

    let statuses = [];
    let where = {
      [Op.or]: statuses,
    };
    let dateFilter = [];
    if (dateTo) {
      dateFilter.push({ [Op.lte]: dateTo });
    }
    if (dateFrom) {
      dateFilter.push({ [Op.gte]: dateFrom });
    }
    if (dateFilter[0]) {
      where.presentation_date = {
        [Op.and]: dateFilter,
      };
    }

    //   if (search) {
    //     where.city_lokal = {
    //       [Op.iLike]: `%${search}%`,
    //     };
    //   }

    const trails = await TrailsService.GetFiltered(country, where, page, pageSize, sort);
    const trailsForCount = await TrailsService.GetFilteredForCount(country, where);
    if (!trails || !trailsForCount) {
      throw ApiError.internal("Трасы не найдены");
    }
    const count = Math.ceil(trailsForCount?.length / pageSize);

    return res.json({ trails, count });
  }
}

module.exports = new TrailsController();
