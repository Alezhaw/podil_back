const ApiError = require("../../error/ApiError");
const Blazor = require("../../api/blazor.js");

const { instance } = Blazor;

const obtainCsvFile = async (content, serverId, campaignId) => {
  try {
    const data = await instance.post("api/Files/ObtainFile", {
      content,
      serverId,
      campaignId,
    });

    return data;
  } catch (e) {
    console.error(e);
  }
};

const importRecords = async (request, serverId, campaignId) => {
  try {
    console.log(3, request);
    const data = await instance.post(`api/Files/ImportCsv/${serverId}/${campaignId}`, [...request]);
    console.log(2, data);
    return data;
  } catch (e) {
    console.error(e);
  }
};

class FilesController {
  async getEUData(req, res, next) {
    const { city, place, date, address, times, campaigns } = req.body;

    if (!city || !place || !date || !address || !times || !campaigns) {
      return next(ApiError.badRequest("Data not found"));
    }

    try {
      const { data } = await instance.post("api/Files/GetEUData", {
        city: city,
        place: place,
        postfix: "KONTROL",
        date,
        address,
        otherCity: "Standard",
        times,
        campaigns,
      });
      return res.json({ data });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Ошибка получения данных"));
    }
  }

  async obtainCsvFile(req, res, next) {
    const { content, serverId, campaignId } = req.body;

    if (!content || !serverId || !campaignId) {
      return next(ApiError.badRequest("Data not found"));
    }
    try {
      const { data } = await obtainCsvFile(content, serverId, campaignId);
      if (!data) {
        return next(ApiError.badRequest("Obtain csv file error"));
      }
      return res.json({ data });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Obtain csv file error"));
    }
  }

  async importRecords(req, res, next) {
    const { request, serverId, campaignId } = req.body;

    if (!request || !serverId || !campaignId) {
      return next(ApiError.badRequest("Data not found"));
    }
    try {
      const { data } = await importRecords(request, serverId, campaignId);
      console.log(1, data);
      if (!data) {
        return next(ApiError.badRequest("Import records error"));
      }
      return res.json({ data });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Import records error"));
    }
  }

  async importCsv(req, res, next) {
    const { content, serverId, campaignId } = req.body;

    if (!content || !serverId || !campaignId) {
      return next(ApiError.badRequest("Data not found"));
    }
    try {
      let request = await obtainCsvFile(content, serverId, campaignId);
      let result = await importRecords(request?.data, serverId, campaignId);
      if (!result) {
        return next(ApiError.badRequest("Import csv error"));
      }
      return res.json({ result: result?.data });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Import csv error"));
    }
  }
}
module.exports = new FilesController();
