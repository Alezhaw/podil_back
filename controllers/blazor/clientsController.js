const ApiError = require("../../error/ApiError");
const Blazor = require("../../api/blazor.js");

const { serviceServer, instance } = Blazor;

class ClientsController {
  async getServer(req, res, next) {
    try {
      const { data } = await instance.get("api/Server/");
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
  async getInstances(req, res, next) {
    try {
      const { data } = await instance.post("api/Clients/GetInstances/", serviceServer);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getProfiles(req, res, next) {
    try {
      const { instanceId } = req.body;
      if (!instanceId) {
        return next(ApiError.badRequest("Укажите instanceId"));
      }
      const { data } = await instance.post(`api/Clients/GetProfiles/${instanceId}`, serviceServer);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getPhoneGroupSets(req, res, next) {
    try {
      const { data } = await instance.post("api/Clients/GetPhoneGroupSets/", serviceServer);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async importData(req, res, next) {
    try {
      const { instanceId, campaignId, phoneGroups, regionsIds } = req.body;
      if (!instanceId || !campaignId || !phoneGroups || !regionsIds) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.post("api/Clients/ImportData", {
        server: serviceServer,
        data: {
          isEmergencyImport: false,
          imports: [
            {
              instanceId,
              campaignId,
              regionsIds,
              operatorCode: null,
              phoneType: -1,
              phoneGroups,
              isImportWithoutAge: false,
              fromAge: null,
              toAge: null,
              phonesActivityOption: 0,
            },
          ],
        },
      });

      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async searchRegions(req, res, next) {
    try {
      const { query } = req.body;
      const { data } = await instance.post("api/Clients/SearchRegions/", { server: serviceServer, limit: 25, currentPage: 1, query });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async createCampaing(req, res, next) {
    try {
      const { campaignName, instanceId, profileId } = req.body;
      if (!campaignName || !instanceId || !profileId) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.post("api/Clients/CreateCampaing/", { server: serviceServer, campaignName, instanceId, profileId });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}
module.exports = new ClientsController();
