const axios = require("axios");
const https = require("https");

const defaultUrl = "https://10.41.4.199:5001/";

const serviceServer = {
  id: "test",
  AccountId: "1",
  URL: "https://10.34.30.22:12000",
};

const instance = axios.create({
  baseURL: defaultUrl,
  headers: { "Content-Type": "application/json", XApiKey: "3f961c47b5b49877fcadb1e8031857b0ce77eea655f5d3b33eea68faaf49c162" },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

// CLIENTS

const getServers = async () => {
  try {
    const { data } = await instance.get("api/Server/");
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getInstance = async () => {
  try {
    const { data } = await instance.post("api/Clients/GetInstances/", serviceServer);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getProfiles = async (instanceId) => {
  try {
    const { data } = await instance.post(`api/Clients/GetProfiles/${instanceId}`, serviceServer);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getPhoneGroupSets = async () => {
  try {
    const { data } = await instance.post("api/Clients/GetPhoneGroupSets/", serviceServer);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const importData = async (instanceId, campaignId, phoneGroups, regionsIds) => {
  try {
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

    return data;
  } catch (e) {
    console.error(e);
  }
};

const searchRegions = async (query) => {
  try {
    const { data } = await instance.post("api/Clients/SearchRegions/", { server: serviceServer, limit: 25, currentPage: 1, query });
    return data;
  } catch (e) {
    console.error(e);
  }
};

const createCampaing = async (campaignName, instanceId, profileId) => {
  try {
    const { data } = await instance.post("api/Clients/CreateCampaing/", { server: serviceServer, campaignName, instanceId, profileId });
    return data;
  } catch (e) {
    console.error(e);
  }
};

// GAZOO

const campaignCallingControl = async (req, res, next) => {
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
};

const getFilteredCampaigns = async (server) => {
  try {
    const instanceForFiltered = axios.create({
      baseURL: defaultUrl,
      headers: { "Content-Type": "application/json", XApiKey: "3f961c47b5b49877fcadb1e8031857b0ce77eea655f5d3b33eea68faaf49c162" },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 1000 * 5,
    });

    const { data } = await instanceForFiltered.post("api/Gazoo/GetFilteredCampaigns/", server);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getGears = async (server) => {
  try {
    const { data } = await instance.post("api/Gazoo/GetGears", server);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getGifts = async (server) => {
  try {
    const { data } = await instance.post("api/Gazoo/GetGifts", server);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getSimulatedAgents = async (server, profileId) => {
  try {
    const { data } = await instance.post(`api/Gazoo/GetSimulatedAgents/${profileId}`, server);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getGates = async (server) => {
  try {
    const { data } = await instance.post("api/Gazoo/GetGates", server);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getGazooProfiles = async (server) => {
  try {
    const { data } = await instance.post("api/Gazoo/GetProfiles", server);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const getCampaign = async (server, campaignId) => {
  try {
    const { data } = await instance.post("api/Gazoo/GetCampaign", { server, campaignId, action: 0 });
    return data;
  } catch (e) {
    console.error(e);
  }
};

const updateCampaign = async (server, campaign) => {
  try {
    const { data } = await instance.put("api/Gazoo/UpdateCampaign", { server, campaign });
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

const campaignResults = async (server, campaignId) => {
  try {
    const { data } = await instance.post("api/Gazoo/CampaignResults", { server, campaignId, action: 0, onlyAttached: true });
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

const getCampaignIdsByDate = async (server, startTime, endTime) => {
  try {
    const instanceWithTimeOut = axios.create({
      baseURL: defaultUrl,
      headers: { "Content-Type": "application/json", XApiKey: "3f961c47b5b49877fcadb1e8031857b0ce77eea655f5d3b33eea68faaf49c162" },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 1000 * 60,
    });

    const { data } = await instanceWithTimeOut.post("api/Gazoo/GetCampaignIdsByDate", { server, startTime, endTime });
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

// Queue

const addCampaign = async (campaignId, serverId, CampaignName, Date) => {
  try {
    const { data } = await instance.post("api/QueueItems/", { campaignId, serverId, scenarioId: -1, type: "mob", IsStoped: true, LastAction: "На паузе", CampaignName, Date });
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

module.exports = {
  defaultUrl,
  serviceServer,
  instance,
  getInstance,
  getServers,
  getProfiles,
  getPhoneGroupSets,
  importData,
  searchRegions,
  createCampaing,
  campaignCallingControl,
  getFilteredCampaigns,
  getGears,
  getGifts,
  getSimulatedAgents,
  getGates,
  getGazooProfiles,
  getCampaign,
  updateCampaign,
  campaignResults,
  getCampaignIdsByDate,
  addCampaign,
};
