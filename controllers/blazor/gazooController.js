const axios = require("axios");
const https = require("https");
const ApiError = require("../../error/ApiError");
const Blazor = require("../../api/blazor.js");

const { defaultUrl, serviceServer, instance } = Blazor;

class GazooController {
  async campaignCallingControl(req, res, next) {
    try {
      const { server, campaignId, action } = req.body;
      if (!server || !campaignId) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.post("api/Gazoo/CampaignCallingControl", { server, campaignId, action: action || 0 });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getFilteredCampaigns(req, res, next) {
    try {
      const { server } = req.body;
      if (!server) {
        return next(ApiError.badRequest("Server not found"));
      }
      const instanceForFiltered = axios.create({
        baseURL: defaultUrl,
        headers: { "Content-Type": "application/json", XApiKey: "3f961c47b5b49877fcadb1e8031857b0ce77eea655f5d3b33eea68faaf49c162" },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 1000 * 5,
      });

      const { data } = await instanceForFiltered.post("api/Gazoo/GetFilteredCampaigns/", server);
      return res.json(data);
    } catch (e) {
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getGears(req, res, next) {
    try {
      const { server } = req.body;
      if (!server) {
        return next(ApiError.badRequest("Server not found"));
      }
      const { data } = await instance.post("api/Gazoo/GetGears", server);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getGifts(req, res, next) {
    try {
      const { server } = req.body;
      if (!server) {
        return next(ApiError.badRequest("Server not found"));
      }
      const { data } = await instance.post("api/Gazoo/GetGifts", server);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getSimulatedAgents(req, res, next) {
    try {
      const { server, profileId } = req.body;
      if (!server || !profileId) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.post(`api/Gazoo/GetSimulatedAgents/${profileId}`, server);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getGates(req, res, next) {
    try {
      const { server } = req.body;
      if (!server) {
        return next(ApiError.badRequest("Server not found"));
      }
      const { data } = await instance.post("api/Gazoo/GetGates", server);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getGazooProfiles(req, res, next) {
    try {
      const { server } = req.body;
      if (!server) {
        return next(ApiError.badRequest("Server not found"));
      }
      const { data } = await instance.post("api/Gazoo/GetProfiles", server);
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async getCampaign(req, res, next) {
    try {
      const { server, campaignId } = req.body;
      if (!server || !campaignId) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.post("api/Gazoo/GetCampaign", { server, campaignId, action: 0 });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }

  async updateCampaign(req, res, next) {
    try {
      const { server, campaign } = req.body;
      if (!server || !campaign) {
        return next(ApiError.badRequest("Укажите все данные"));
      }
      const { data } = await instance.put("api/Gazoo/UpdateCampaign", { server, campaign });
      return res.json(data);
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest("Непредвиденная ошибка"));
    }
  }
}
module.exports = new GazooController();
