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
const DepartureService = require("../../services/trails/departureService");
const DepartureDateService = require("../../services/trails/departureDateService");
const { Op } = require("sequelize");

class TrailsController {
  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await TrailsService.getAll(country));
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

    const trails = await TrailsService.getByWhere(country, where);

    if (!trails) {
      return next(ApiError.internal("Города не найдены"));
    }
    return res.json({ trails });
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
      !trail.call_template_id ||
      !trail.departure_id ||
      !trail.departure_date_id
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
      let departureDate = await DepartureDateService.getById(country, trail.departure_date_id);
      departureDate = departureDate.dataValues;
      departureDate = { ...departureDate, trails_id: [...departureDate.trails_id, newTrail.dataValues.id] };
      let updatedDepartureDate = await DepartureDateService.update({ country, departureDate });
      return res.json(newTrail);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка", e));
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
      !trail.call_template_id ||
      !trail.departure_id ||
      !trail.departure_date_id
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
      return next(ApiError.badRequest("Project concent не найден"));
    }
    const checkCallTemplate = await CallTemplateService.getById(country, trail.call_template_id);
    if (!checkCallTemplate) {
      return next(ApiError.badRequest("Call template не найден"));
    }
    if (trail.form_id) {
      const checkForm = await FormService.getById(country, trail.form_id);
      if (!checkForm) {
        return next(ApiError.badRequest("Город не найден"));
      }
    }
    if (trail.contract_status_id) {
      const checkContractStatus = await ContactStatusService.getById(country, trail.contract_status_id);
      if (!checkContractStatus) {
        return next(ApiError.badRequest("Статус не найден"));
      }
    }
    try {
      const updatedTrail = await TrailsService.update({ country, trail });
      global.io.to("1").emit("updateTrails", {
        data: { trails: [trail], country },
      });
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

    let where = {};
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
    if (!!planningPersonIds[0]) {
      where.planning_person_id = {
        [Op.or]: planningPersonIds,
      };
    }
    if (searchRoute) {
      where.route_number = searchRoute;
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
      if (!citiesId[0]) {
        return next(ApiError.badRequest("Город не найден"));
      }
      where.city_id = {
        [Op.or]: citiesId,
      };
    }
    where.relevance_status = true;
    const trails = await TrailsService.GetFiltered(country, where, page, pageSize, sort);
    const trailsForCount = await TrailsService.GetFilteredForCount(country, where);
    if (!trails || !trailsForCount) {
      return next(ApiError.badRequest("Трасы не найдены"));
    }
    const count = Math.ceil(trailsForCount?.length / pageSize);

    return res.json({ trails, count });
  }

  async getDictionaryByTrails(req, res, next) {
    const { trails, country } = req.body;

    if (!country || !trails[0]) {
      return next(ApiError.badRequest("Укажите все данные"));
    }

    let dictionaryIds = [
      { ids: [], key: "call_template_id", service: CallTemplateService, array: "callTamplates" },
      { ids: [], key: "city_id", service: CitiesWithRegService, array: "citiesWithRegions" },
      { ids: [], key: "contract_status_id", service: ContactStatusService, array: "contractStatuses" },
      { ids: [], key: "form_id", service: FormService, array: "forms" },
      { ids: [], key: "planning_person_id", service: PlanningPersonService, array: "planningPeople" },
      { ids: [], key: "presentation_time_id", service: PresentationTimeService, array: "presentationTimes" },
      { ids: [], key: "project_concent_id", service: ProjectConcentService, array: "projectConcent" },
      { ids: [], key: "project_sales_id", service: ProjectSalesService, array: "projectSales" },
      { ids: [], key: "company_id", service: RegimentService, array: "regiments" },
      { ids: [], key: "regionId", service: RegionService, array: "regions" },
      { ids: [], key: "reservation_status_id", service: ReservationStatusService, array: "reservationStatuses" },
      { ids: [], key: "departure_id", service: DepartureService, array: "departure" },
      { ids: [], key: "departure_date_id", service: DepartureDateService, array: "departureDate" },
    ];

    const dictionary = {};

    trails.map((item) => {
      dictionaryIds?.map((el) => {
        el.ids.includes(item[el.key]) || el.ids.push(item[el.key]);
      });
    });
    try {
      await Promise.all(
        dictionaryIds
          ?.filter((item) => !!item.ids?.filter((el) => !!el)[0])
          ?.map(async (el) => {
            let actions = [];
            el.ids.map((id) => actions.push({ id: Number(id) }));

            let where = {
              [Op.or]: actions,
            };
            const data = await el.service.getByWhere(country, where);
            dictionary[el.array] = data;
          })
      );
    } catch (e) {
      console.log(e);
    }

    return res.json({ ...dictionary });
  }

  async getAllDictionary(req, res, next) {
    const { country } = req.body;

    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    let dictionary = [
      { service: CallTemplateService, array: "callTamplates" },
      { service: ContactStatusService, array: "contractStatuses" },
      { service: PlanningPersonService, array: "planningPeople" },
      { service: PresentationTimeService, array: "presentationTimes" },
      { service: ProjectConcentService, array: "projectConcent" },
      { service: ProjectSalesService, array: "projectSales" },
      { service: RegimentService, array: "regiments" },
      { service: RegionService, array: "regions" },
      { service: ReservationStatusService, array: "reservationStatuses" },
    ];
    const allDictionary = {};

    try {
      await Promise.all(
        dictionary?.map(async (el) => {
          const data = await el.service.getAll(country);
          allDictionary[el.array] = data;
        })
      );
    } catch (e) {
      console.log(e);
    }

    return res.json(allDictionary);
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
      global.io.to("1").emit("deleteTrails", {
        data: { id, country },
      });
      return res.json("success");
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}

module.exports = new TrailsController();
