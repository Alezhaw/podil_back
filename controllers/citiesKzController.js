const ApiError = require("../error/ApiError");
const ObjectHelper = require("../utils/objectHelper");
const { KzCities } = require("../models/models");

function checkValue(check_base, check_speaker, check_scenario) {
  switch ("boolean") {
    case typeof check_base:
      return { check_base: !!check_base };
    case typeof check_speaker:
      return { check_speaker: !!check_speaker };
    case typeof check_scenario:
      return { check_scenario: !!check_scenario };
  }
}

class CitiesController {
  async create(req, res, next) {
    let user = req.user;
    const { data } = req.body;
    let updated = "";
    let not_id_for_base = "";
    let error = [];
    let cities = [];
    const forPostman = [{ ...req.body }];
    //console.log(1, data, req.body)
    const result = await Promise.all(
      data.map(async (item, index) => {
        if (!item.id_for_base) {
          not_id_for_base = `${not_id_for_base}/${item.miasto_lokal}`;
          return;
        }
        if (item?.id !== "create") {
          const checkUnique = (await KzCities.findOne({ where: { id: Number(item.id) || null } })) || (await KzCities.findOne({ where: { id_for_base: item.id_for_base, godzina: item.godzina } }));

          if (checkUnique) {
            try {
              const result = ObjectHelper.sendDifferencesToDatabase(checkUnique, item, "kazakhstan", "update", user, "city");
              if (!result) {
                error.push({
                  miasto: item.miasto_lokal,
                  id_for_base: item.id_for_base,
                  error: "Failed to write log",
                });
                return;
              }
              await KzCities.update(item, { where: { id: checkUnique.id } });
              updated = `${updated}/${item.id_for_base}`;
              return;
            } catch (e) {
              return error.push({
                miasto: item.miasto_lokal,
                id_for_base: item.id_for_base,
                error: e.message,
              });
            }
          }
        }
        try {
          const city = await KzCities.create(item);
          cities.push(city.dataValues);
          const result = ObjectHelper.sendDifferencesToDatabase(city, item, "kazakhstan", "create", user, "city");
          if (!result) {
            error.push({
              miasto: item.miasto_lokal,
              id_for_base: item.id_for_base,
              error: "Failed to write log",
            });
          }
        } catch (e) {
          return error.push({
            miasto: item.miasto_lokal,
            id_for_base: item.id_for_base,
            error: e.message,
          });
        }
      })
    );
    return res.json({
      cities,
      updated,
      not_id_for_base,
      error,
    });
  }

  async getAll(req, res) {
    const cities = await KzCities.findAll();
    return res.json(cities);
  }

  async getFilteredCities(req, res, next) {
    const { search, inProgress, zamkniete, baseInProgress, baseZamkniete, scenarioInProgress, scenarioZamkniete, speakerInProgress, speakerZamkniete, sort, pageSize, page } = req.body;

    if (!pageSize || !page) {
      return next(ApiError.badRequest("Укажите page и pageSize"));
    }
    const city = await KzCities.findAll();
    if (!city) {
      return next(ApiError.internal("Нет городов в базе данных"));
    }
    let filteredCities = city
      ?.filter((el) => (search ? el?.miasto_lokal?.toLowerCase()?.includes(search.toLowerCase()) : true))
      ?.filter((item, i, ar) => {
        return ar.map((el) => el.id_for_base).indexOf(item.id_for_base) === i;
      })
      ?.filter(
        (checkbox) =>
          (!checkbox?.zamkniete && inProgress) ||
          (!!checkbox?.zamkniete && zamkniete) ||
          (!checkbox?.check_base && baseInProgress) ||
          (!!checkbox?.check_base && baseZamkniete) ||
          (!checkbox?.check_scenario && scenarioInProgress) ||
          (!!checkbox?.check_scenario && scenarioZamkniete) ||
          (!checkbox?.check_speaker && speakerInProgress) ||
          (!!checkbox?.check_speaker && speakerZamkniete)
      )
      ?.sort((a, b) => (!sort ? Number(b.id_for_base) - Number(a.id_for_base) : Number(a.id_for_base) - Number(b.id_for_base)))
      ?.slice(page * pageSize - pageSize, page * pageSize)
      ?.map((el) => city?.filter((time) => time.id_for_base === el.id_for_base))
      ?.flat();
    return res.json(filteredCities);
  }

  async getOneCity(req, res, next) {
    const { id, id_for_base } = req.body;

    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    const city = id ? await KzCities.findOne({ where: { id: Number(id) } }) : await KzCities.findAll({ where: { id_for_base: Number(id_for_base) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    return res.json(city);
  }

  async changeCity(req, res, next) {
    const {
      id,
      l_p,
      godzina,
      os_poj,
      pary,
      wyjasnienia,
      projekt,
      miasto_lokal,
      timezone,
      limit,
      dodawanie_rekordow,
      scenariusze,
      weryfikacja_dkj,
      podpinanie_scenariuszy,
      present,
      rekodow_na_1_zgode,
      wb_1,
      wb_2,
      ilosc_zaproszen,
      dzien_1_data,
      dzien_1_rekodow_na_1_zgode,
      dzien_1_aktualna_ilosc_zaproszen,
      dzien_2_data,
      dzien_2_rekodow_na_1_zgode,
      dzien_2_aktualna_ilosc_zaproszen,
      dzien_3_data,
      dzien_3_rekodow_na_1_zgode,
      dzien_3_aktualna_ilosc_zaproszen,
      vip_id,
      vip_format,
      vip_limit,
      vip_coming,
      vip_total_steam,
      vip_percent_coming,
      system,
      zgoda_wyniki_potwierdzen,
      odmowy_wyniki_potwierdzen,
      kropki_wyniki_potwierdzen,
      sms_umawianie,
      sms_potwierdzen,
      wiretap_note,
      wiretapping_sogl,
      base_stat_1,
      base_stat_2,
      base_stat_3,
      base_stat_4,
      base_stat_5,
      id_for_base,
      w_toku,
      zamkniete,
      base_stat_6,
      zgody_inne_miasto,
      check_base,
      check_speaker,
      check_scenario,
    } = req.body;

    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }
    const city = await KzCities.findOne({ where: { id: Number(id) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    const updatedCity = await KzCities.update(
      {
        l_p: Number(l_p) || null,
        godzina: godzina || null,
        os_poj: os_poj || null,
        pary: pary || null,
        wyjasnienia: !!wyjasnienia ?? null,
        projekt: projekt || null,
        miasto_lokal: miasto_lokal || null,
        timezone: Number(timezone) || null,
        limit: Number(limit) || null,
        dodawanie_rekordow: dodawanie_rekordow || null,
        scenariusze: scenariusze || null,
        weryfikacja_dkj: weryfikacja_dkj || null,
        podpinanie_scenariuszy: podpinanie_scenariuszy || null,
        present: present || null,
        rekodow_na_1_zgode: Number(rekodow_na_1_zgode) || null,
        wb_1: wb_1 || null,
        wb_2: Number(wb_2) || null,
        ilosc_zaproszen: Number(ilosc_zaproszen),
        dzien_1_data: dzien_1_data || null,
        dzien_1_rekodow_na_1_zgode: Number(dzien_1_rekodow_na_1_zgode) || null,
        dzien_1_aktualna_ilosc_zaproszen: Number(dzien_1_aktualna_ilosc_zaproszen) || null,
        dzien_2_data: dzien_2_data || null,
        dzien_2_rekodow_na_1_zgode: Number(dzien_2_rekodow_na_1_zgode) || null,
        dzien_2_aktualna_ilosc_zaproszen: Number(dzien_2_aktualna_ilosc_zaproszen) || null,
        dzien_3_data: dzien_3_data || null,
        dzien_3_rekodow_na_1_zgode: Number(dzien_3_rekodow_na_1_zgode) || null,
        dzien_3_aktualna_ilosc_zaproszen: Number(dzien_3_aktualna_ilosc_zaproszen) || null,
        vip_id: vip_id || null,
        vip_format: vip_format || null,
        vip_limit: vip_limit || null,
        vip_coming: vip_coming || null,
        vip_total_steam: vip_total_steam || null,
        vip_percent_coming: vip_percent_coming || null,
        system: system || null,
        zgoda_wyniki_potwierdzen: Number(zgoda_wyniki_potwierdzen) || null,
        odmowy_wyniki_potwierdzen: Number(odmowy_wyniki_potwierdzen) || null,
        kropki_wyniki_potwierdzen: Number(kropki_wyniki_potwierdzen) || null,
        sms_umawianie: !!sms_umawianie ?? null,
        sms_potwierdzen: !!sms_potwierdzen ?? null,
        wiretap_note: wiretap_note || null,
        wiretapping_sogl: wiretapping_sogl || null,
        base_stat_1: base_stat_1 || null,
        base_stat_2: base_stat_2 || null,
        base_stat_3: base_stat_3 || null,
        base_stat_4: base_stat_4 || null,
        base_stat_5: base_stat_5 || null,
        id_for_base: Number(id_for_base) || null,
        w_toku: !!w_toku ?? null,
        zamkniete: !!zamkniete ?? null,
        base_stat_6: base_stat_6 || null,
        zgody_inne_miasto: Number(zgody_inne_miasto) || null,
        check_base: !!check_base ?? null,
        check_speaker: !!check_speaker ?? null,
        check_scenario: !!check_scenario ?? null,
      },
      { where: { id: city.id } }
    );

    return res.json(updatedCity);
  }

  async changeCheck(req, res, next) {
    const { id, id_for_base, check_base, check_speaker, check_scenario } = req.body;
    let user = req.user;
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    if (typeof (check_base ?? check_speaker ?? check_scenario) !== "boolean") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    const city = id ? await KzCities.findOne({ where: { id: Number(id) || null } }) : await KzCities.findOne({ where: { id_for_base } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }

    const cities = await KzCities.findAll({ where: { id_for_base: city.id_for_base } });

    const result = cities?.map((city) =>
      ObjectHelper.sendDifferencesToDatabase(city, { ...city.dataValues, ...checkValue(check_base, check_speaker, check_scenario) }, "kazakhstan", "update", user, "city")
    );
    if (!result[0]) {
      return next(ApiError.internal("Failed to write log"));
    }
    const updated = await KzCities.update(checkValue(check_base, check_speaker, check_scenario), { where: { id_for_base: city.id_for_base } });
    const allCities = await KzCities.findAll();

    return res.json(allCities);
  }

  async deleteCity(req, res, next) {
    const { id_for_base } = req.body;
    let user = req.user;

    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    const city = await KzCities.findOne({ where: { id_for_base: Number(id_for_base) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }

    const cities = await KzCities.findAll({ where: { id_for_base: Number(id_for_base) } });

    const result = cities?.map((city) => ObjectHelper.sendDifferencesToDatabase(city, city.dataValues, "kazakhstan", "delete", user, "city"));
    if (!result[0]) {
      return next(ApiError.internal("Failed to write log"));
    }
    try {
      await KzCities.destroy({
        where: { id_for_base: city.id_for_base },
      });
      return res.json({ ...city.dataValues });
    } catch (e) {
      return next(ApiError.internal("Delete failed"));
    }
  }

  async deleteOneTime(req, res, next) {
    const { id } = req.body;
    let user = req.user;
    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }
    const city = await KzCities.findOne({ where: { id: Number(id) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    const result = ObjectHelper.sendDifferencesToDatabase(city, city.dataValues, "kazakhstan", "delete", user, "city");
    if (!result) {
      return next(ApiError.internal("Failed to write log"));
    }
    await KzCities.destroy({
      where: { id },
    });
    return res.json({ ...city.dataValues });
  }
}

module.exports = new CitiesController();
