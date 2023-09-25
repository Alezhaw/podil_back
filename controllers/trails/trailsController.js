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
    if (
      !country ||
      !trail ||
      !trail.planning_person_id ||
      !trail.date_scheduled ||
      !trail.company_id ||
      !trail.route_number ||
      !trail.departure_dates ||
      !trail.presentation_date ||
      !trail.presentation_time_id ||
      !trail.regionId ||
      !trail.city_id ||
      !trail.autozonning ||
      !trail.reservation_status_id ||
      !trail.project_sales_id ||
      !trail.project_concent_id ||
      !trail.call_template_id
    ) {
      return next(ApiError.badRequest("Заполните все поля"));
    }
    if (trail.id) {
      return next(ApiError.badRequest("Презентация уже есть"));
    }

    const checkPlanningPerson = await PlanningPersonService.getById(country, trail.planning_person_id);
    if (!checkPlanningPerson) {
      throw ApiError.internal("Planning person не найден");
    }
    const checkCompany = await RegimentService.getById(country, trail.company_id);
    if (!checkCompany) {
      throw ApiError.internal("Company не найдена");
    }
    const checkPresentationTime = await PresentationTimeService.getById(country, trail.presentation_time_id);
    if (!checkPresentationTime) {
      throw ApiError.internal("Presentation time не найден");
    }
    const checkRegion = await RegionService.getById(country, trail.regionId);
    if (!checkRegion) {
      throw ApiError.internal("Область не найдена");
    }
    const checkCity = await CitiesWithRegService.getById(country, trail.city_id);
    if (!checkCity) {
      throw ApiError.internal("Город не найден");
    }
    const checkReservationStatus = await ReservationStatusService.getById(country, trail.reservation_status_id);
    if (!checkReservationStatus) {
      throw ApiError.internal("Статус резервирования не найден");
    }
    const checkProjectSales = await ProjectSalesService.getById(country, trail.project_sales_id);
    if (!checkProjectSales) {
      throw ApiError.internal("Project sales не найден");
    }
    const checkProjectConcent = await ProjectConcentService.getById(country, trail.project_concent_id);
    if (!checkProjectConcent) {
      throw ApiError.internal("Project concent не найден");
    }
    const checkCallTemplate = await CallTemplateService.getById(country, trail.call_template_id);
    if (!checkCallTemplate) {
      throw ApiError.internal("Call template не найден");
    }

    try {
      const newTrail = await TrailsService.create({ country, trail });
      return res.json(newTrail);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async update(req, res, next) {
    const { country, trail } = req.body;
    if (
      !country ||
      !trail ||
      !trail.planning_person_id ||
      !trail.date_scheduled ||
      !trail.company_id ||
      !trail.route_number ||
      !trail.departure_dates ||
      !trail.presentation_date ||
      !trail.presentation_time_id ||
      !trail.regionId ||
      !trail.city_id ||
      !trail.autozonning ||
      !trail.reservation_status_id ||
      !trail.project_sales_id ||
      !trail.project_concent_id ||
      !trail.call_template_id
    ) {
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
    const checkCompany = await RegimentService.getById(country, trail.company_id);
    if (!checkCompany) {
      throw ApiError.internal("Company не найдена");
    }
    const checkPresentationTime = await PresentationTimeService.getById(country, trail.presentation_time_id);
    if (!checkPresentationTime) {
      throw ApiError.internal("Presentation time не найден");
    }
    const checkRegion = await RegionService.getById(country, trail.regionId);
    if (!checkRegion) {
      throw ApiError.internal("Область не найдена");
    }
    const checkCity = await CitiesWithRegService.getById(country, trail.city_id);
    if (!checkCity) {
      throw ApiError.internal("Город не найден");
    }
    const checkReservationStatus = await ReservationStatusService.getById(country, trail.reservation_status_id);
    if (!checkReservationStatus) {
      throw ApiError.internal("Статус резервирования не найден");
    }
    const checkProjectSales = await ProjectSalesService.getById(country, trail.project_sales_id);
    if (!checkProjectSales) {
      throw ApiError.internal("Project sales не найден");
    }
    const checkProjectConcent = await ProjectConcentService.getById(country, trail.project_concent_id);
    if (!checkProjectConcent) {
      throw ApiError.internal("Project concent не найден");
    }
    const checkCallTemplate = await CallTemplateService.getById(country, trail.call_template_id);
    if (!checkCallTemplate) {
      throw ApiError.internal("Call template не найден");
    }
    if (trail.form_id) {
      const checkForm = await FormService.getById(country, trail.form_id);
      if (!checkForm) {
        throw ApiError.internal("Город не найден");
      }
    }
    if (trail.contract_status_id) {
      const checkContractStatus = await ContactStatusService.getById(country, trail.contract_status_id);
      if (!checkContractStatus) {
        throw ApiError.internal("Статус не найден");
      }
    }
    try {
      const updatedTrail = await TrailsService.update({ country, trail });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getFiltered(req, res, next) {
    const { search, searchRoute, planningPersonIds, dateTo, dateFrom, sort, pageSize, page, country } = req.body;

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
    if (planningPersonIds) {
      where.planning_person_id = {
        [Op.or]: planningPersonIds,
      };
    }
    if (searchRoute) {
      where.route_number = {
        [Op.iLike]: `%${searchRoute}%`,
      };
    }

    if (search) {
      const whereForCity = {
        city_name: { [Op.iLike]: `%${search}%` },
      };
      const cities = await CitiesWithRegService.getByWhere(country, whereForCity);
      let citiesId = [];
      cities.map((city) => {
        city = city.dataValues;
        citiesId.push(city.id);
      });
      where.city_id = {
        [Op.or]: citiesId,
      };
    }

    const trails = await TrailsService.GetFiltered(country, where, page, pageSize, sort);
    const trailsForCount = await TrailsService.GetFilteredForCount(country, where);
    if (!trails || !trailsForCount) {
      throw ApiError.internal("Трасы не найдены");
    }
    const count = Math.ceil(trailsForCount?.length / pageSize);

    return res.json({ trails, count });
  }

  async remove(req, res) {
    const { id, country, relevance_status } = req.body;
    if (!country || !id) {
      return next(ApiError.badRequest("Укажите все данные"));
    }
    const item = await TrailsService.getById(country, id);

    if (!item) {
      return next(ApiError.badRequest("Элемент не найден"));
    }

    try {
      const updatedCallTemplate = await TrailsService.remove(country, !!relevance_status, id);
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new TrailsController();
