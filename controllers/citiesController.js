const ApiError = require("../error/ApiError");
const CityService = require("../services/cityService");

class CitiesController {
  async create(req, res, next) {
    let user = req.user;
    const { data, country } = req.body;
    let result = await CityService.UpdateOrCreate(data, user, country);
    return res.json(result);
  }

  async getAll(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    return res.json(await CityService.GetAll(country));
  }

  async getMaxIdForBase(req, res, next) {
    const { country } = req.body;
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    return res.json(await CityService.getMaxIdForBase(country));
  }

  async fixDate(req, res) {
    await CityService.fixDate();
    return res.json(123);
  }

  async getFilteredCities(req, res, next) {
    const {
      search,
      canceled,
      inProgress,
      zamkniete,
      baseInProgress,
      baseZamkniete,
      baseCanceled,
      scenarioInProgress,
      scenarioZamkniete,
      scenarioCanceled,
      speakerInProgress,
      speakerZamkniete,
      speakerCanceled,
      sort,
      pageSize,
      page,
      country,
    } = req.body;
    console.log(req.body);
    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }
    console.log(1);
    const city = await CityService.GetAll(country);
    console.log(2);
    if (!city) {
      return next(ApiError.internal("Нет городов в базе данных"));
    }

    let filteredCities = city
      ?.filter((el) => (search ? el?.city_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.id_for_base).indexOf(item.id_for_base) === i;
      })
      ?.filter((checkbox) => (checkbox?.status === 2 && zamkniete) || (checkbox?.status === 0 && canceled) || (checkbox?.status !== 2 && checkbox?.status !== 0 && inProgress))
      ?.filter(
        (checkbox) =>
          (!checkbox?.check_base && checkbox?.status !== 0 && baseInProgress) || (!!checkbox?.check_base && checkbox?.status !== 0 && baseZamkniete) || (checkbox?.status === 0 && baseCanceled)
      )
      //?.filter((checkbox) => baseCanceled && checkbox?.status !== 0)
      ?.filter(
        (checkbox) =>
          (!checkbox?.check_scenario && checkbox?.status !== 0 && scenarioInProgress) ||
          (!!checkbox?.check_scenario && checkbox?.status !== 0 && scenarioZamkniete) ||
          (checkbox?.status === 0 && scenarioCanceled)
      )
      ?.filter(
        (checkbox) =>
          (!checkbox?.check_speaker && checkbox?.status !== 0 && speakerInProgress) ||
          (!!checkbox?.check_speaker && checkbox?.status !== 0 && speakerZamkniete) ||
          (checkbox?.status === 0 && speakerCanceled)
      )
      ?.sort((a, b) => (!sort ? Number(b.id_for_base) - Number(a.id_for_base) : Number(a.id_for_base) - Number(b.id_for_base)));
    const count = Math.ceil(filteredCities?.length / pageSize);
    filteredCities = filteredCities
      ?.slice(page * pageSize - pageSize, page * pageSize)
      ?.map((el) => city?.filter((time) => time.id_for_base === el.id_for_base))
      ?.flat();

    return res.json({ cities: filteredCities, count });
  }

  async getOneCity(req, res, next) {
    const { id, id_for_base, country } = req.body;

    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    const city = id ? await CityService.GetTimeById(id, country) : await CityService.GetTimes(id_for_base, country);
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    return res.json(city);
  }

  async changeCheck(req, res, next) {
    const { id, id_for_base, check_base, check_speaker, check_scenario, country } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    if (typeof (check_base ?? check_speaker ?? check_scenario) !== "boolean") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    try {
      let result = await CityService.ChangeCheck(id, id_for_base, check_base, check_speaker, check_scenario, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async changeStatus(req, res, next) {
    const { id, id_for_base, status, country } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (typeof status !== "number") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }
    try {
      let result = await CityService.ChangeStatus(id, id_for_base, status, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteCity(req, res, next) {
    const { id_for_base, country } = req.body;
    let user = req.user;

    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }

    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    try {
      let result = await CityService.DeleteCity(id_for_base, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteTime(req, res, next) {
    const { id, country } = req.body;
    let user = req.user;

    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }

    if (!country) {
      return next(ApiError.badRequest("Укажите country"));
    }

    try {
      let result = await CityService.DeleteTime(id, user, country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async test(req, res, next) {
    const { inProgress, canceled, zamkniete, search, country } = req.body;
    try {
      let result = await CityService.GetFiltered(inProgress, canceled, zamkniete, "test", country);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CitiesController();
