const { DataTypes } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Cities } = require("../models/models");

function getObjectForDataBase(item) {
  return {
    l_p: Number(item.l_p) || null,
    godzina: item.godzina || null,
    os_poj: item.os_poj || null,
    pary: item.pary || null,
    wyjasnienia: !!item.wyjasnienia ?? null,
    projekt: item.projekt || null,
    miasto_lokal: item.miasto_lokal || null,
    timezone: Number(item.timezone) || null,
    limit: Number(item.limit) || null,
    dodawanie_rekordow: item.dodawanie_rekordow || null,
    scenariusze: item.scenariusze || null,
    weryfikacja_dkj: item.weryfikacja_dkj || null,
    podpinanie_scenariuszy: item.podpinanie_scenariuszy || null,
    present: item.present || null,
    rekodow_na_1_zgode: Number(item.rekodow_na_1_zgode) || null,
    wb_1: item.wb_1 || null,
    wb_2: Number(item.wb_2) || null,
    ilosc_zaproszen: Number(item.ilosc_zaproszen) || null,
    dzien_1_data: item.dzien_1_data || null,
    dzien_1_rekodow_na_1_zgode: Number(item.dzien_1_rekodow_na_1_zgode) || null,
    dzien_1_aktualna_ilosc_zaproszen: Number(item.dzien_1_aktualna_ilosc_zaproszen) || null,
    dzien_2_data: item.dzien_2_data || null,
    dzien_2_rekodow_na_1_zgode: Number(item.dzien_2_rekodow_na_1_zgode) || null,
    dzien_2_aktualna_ilosc_zaproszen: Number(item.dzien_2_aktualna_ilosc_zaproszen) || null,
    dzien_3_data: item.dzien_3_data || null,
    dzien_3_rekodow_na_1_zgode: Number(item.dzien_3_rekodow_na_1_zgode) || null,
    dzien_3_aktualna_ilosc_zaproszen: Number(item.dzien_3_aktualna_ilosc_zaproszen) || null,
    vip_id: item.vip_id || null,
    vip_format: item.vip_format || null,
    vip_limit: item.vip_limit || null,
    vip_coming: item.vip_coming || null,
    vip_total_steam: item.vip_total_steam || null,
    vip_percent_coming: item.vip_percent_coming || null,
    system: item.system || null,
    zgoda_wyniki_potwierdzen: Number(item.zgoda_wyniki_potwierdzen) || null,
    odmowy_wyniki_potwierdzen: Number(item.odmowy_wyniki_potwierdzen) || null,
    kropki_wyniki_potwierdzen: Number(item.kropki_wyniki_potwierdzen) || null,
    sms_umawianie: !!item.sms_umawianie ?? null,
    sms_potwierdzen: !!item.sms_potwierdzen ?? null,
    wiretap_note: item.wiretap_note || null,
    wiretapping_sogl: item.wiretapping_sogl || null,
    base_stat_1: item.base_stat_1 || null,
    base_stat_2: item.base_stat_2 || null,
    base_stat_3: item.base_stat_3 || null,
    base_stat_4: item.base_stat_4 || null,
    base_stat_5: item.base_stat_5 || null,
    id_for_base: Number(item.id_for_base) || null,
    w_toku: !!item.w_toku ?? null,
    zamkniete: !!item.zamkniete ?? null,
    base_stat_6: item.base_stat_6 || null,
    zgody_inne_miasto: Number(item.zgody_inne_miasto) || null,
    check_base: !!item.check_base ?? null,
    check_speaker: !!item.check_speaker ?? null,
    check_scenario: !!item.check_scenario ?? null,
  };
}

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
          const checkUnique = (await Cities.findOne({ where: { id: Number(item.id) || null } })) || (await Cities.findOne({ where: { id_for_base: item.id_for_base, godzina: item.godzina } }));
          if (checkUnique) {
            try {
              await Cities.update(getObjectForDataBase(item), { where: { id: checkUnique.id } });
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
          //console.log(1, item.rekodow_na_1_zgode, Number(item.rekodow_na_1_zgode), typeof (item.rekodow_na_1_zgode), typeof (Number(item.rekodow_na_1_zgode)))
          const city = await Cities.create(getObjectForDataBase(item));
          cities.push(city.dataValues);
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
    const cities = await Cities.findAll();
    return res.json(cities);
  }

  async getOneCity(req, res, next) {
    const { id, id_for_base } = req.body;

    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    const city = (await Cities.findOne({ where: { id: Number(id) } })) || (await Cities.findAll({ where: { id_for_base: Number(id_for_base) } }));
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
    const city = await Cities.findOne({ where: { id: Number(id) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    const updatedCity = await Cities.update(
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
    if (!id && !id_for_base) {
      return next(ApiError.badRequest("Укажите id или id_for_base"));
    }
    console.log(1, check_base, typeof check_base, typeof check_base === "boolean", check_base ?? check_speaker ?? check_scenario);
    if (typeof (check_base ?? check_speaker ?? check_scenario) !== "boolean") {
      return next(ApiError.badRequest("Укажите данные для замены"));
    }
    const city = (await Cities.findOne({ where: { id: Number(id) || null } })) || (await Cities.findOne({ where: { id_for_base } }));
    const updated = await Cities.update(checkValue(check_base, check_speaker, check_scenario), { where: { id_for_base: city.id_for_base } });
    const test = await Cities.findAll({ where: { id_for_base: city.id_for_base } });
    console.log("test", check_base, check_speaker, check_scenario, test);

    const allCities = await Cities.findAll();

    return res.json(allCities);
  }

  async deleteCity(req, res, next) {
    const { id_for_base } = req.body;
    if (!id_for_base) {
      return next(ApiError.badRequest("Укажите id_for_base"));
    }
    const city = await Cities.findOne({ where: { id_for_base: Number(id_for_base) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    await Cities.destroy({
      where: { id_for_base: city.id_for_base },
    });
    return res.json({ ...city.dataValues });
  }

  async deleteOneTime(req, res, next) {
    const { id } = req.body;
    if (!id) {
      return next(ApiError.badRequest("Укажите id"));
    }
    const city = await Cities.findOne({ where: { id: Number(id) } });
    if (!city) {
      return next(ApiError.internal("Город не найден"));
    }
    await Cities.destroy({
      where: { id },
    });
    return res.json({ ...city.dataValues });
  }
}

module.exports = new CitiesController();
