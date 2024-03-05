// const axios = require("axios");
// const https = require("https");
// const ApiError = require("../error/ApiError");

// const defaultUrl = "https://10.41.4.199:5001/";

// const serviceServer = {
//   id: "test",
//   AccountId: "1",
//   URL: "https://10.34.30.22:12000",
// };

// const instance = axios.create({
//   baseURL: defaultUrl,
//   headers: { "Content-Type": "application/json", XApiKey: "3f961c47b5b49877fcadb1e8031857b0ce77eea655f5d3b33eea68faaf49c162" },
//   httpsAgent: new https.Agent({ rejectUnauthorized: false }),
// });

// // CLIENTS

// const getServer = async () => {
//   try {
//     const { data } = await instance.get("api/Server/");
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getInstances = async () => {
//   try {
//     const { data } = await instance.post("api/Clients/GetInstances/", serviceServer);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getProfiles = async (instanceId) => {
//   try {
//     const { data } = await instance.post(`api/Clients/GetProfiles/${instanceId}`, serviceServer);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getPhoneGroupSets = async () => {
//   try {
//     const { data } = await instance.post("api/Clients/GetPhoneGroupSets/", serviceServer);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const importData = async (instanceId, campaignId, phoneGroups, regionsIds) => {
//   try {
//     const { data } = await instance.post("api/Clients/ImportData", {
//       server: serviceServer,
//       data: {
//         isEmergencyImport: false,
//         imports: [
//           {
//             instanceId,
//             campaignId,
//             regionsIds,
//             operatorCode: null,
//             phoneType: -1,
//             phoneGroups,
//             isImportWithoutAge: false,
//             fromAge: null,
//             toAge: null,
//             phonesActivityOption: 0,
//           },
//         ],
//       },
//     });

//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const searchRegions = async (query) => {
//   try {
//     const { data } = await instance.post("api/Clients/SearchRegions/", { server: serviceServer, limit: 25, currentPage: 1, query });
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const createCampaing = async (campaignName, instanceId, profileId) => {
//   try {
//     const { data } = await instance.post("api/Clients/CreateCampaing/", { server: serviceServer, campaignName, instanceId, profileId });
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// // GAZOO

// const getFilteredCampaigns = async (server) => {
//   try {
//     const { data } = await instance.post("api/Gazoo/GetFilteredCampaigns/", server);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getGears = async (server) => {
//   try {
//     const { data } = await instance.post("api/Gazoo/GetGears", server);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getGifts = async (server) => {
//   try {
//     const { data } = await instance.post("api/Gazoo/GetGifts", server);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getSimulatedAgents = async (server, profileId) => {
//   try {
//     const { data } = await instance.post(`api/Gazoo/GetSimulatedAgents/${profileId}`, server);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getGates = async (server) => {
//   try {
//     const { data } = await instance.post("api/Gazoo/GetGates", server);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getGazooProfiles = async (server) => {
//   try {
//     const { data } = await instance.post("api/Gazoo/GetProfiles", server);
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const getCampaign = async (server, campaignId) => {
//   try {
//     const { data } = await instance.post("api/Gazoo/GetCampaign", { server, campaignId, action: 0 });
//     return data;
//   } catch (e) {
//     console.error(e);
//   }
// };

// const updateCampaign = async (server, campaign) => {
//   try {
//     const { data } = await instance.put("api/Gazoo/UpdateCampaign", { server, campaign });
//     return data;
//   } catch (e) {
//     console.error(e);
//     return e;
//   }
// };

// // Queue

// const addCampaign = async (campaignId, serverId) => {
//   try {
//     const { data } = await instance.post("api/QueueItems/", { campaignId, serverId, scenarioId: -1, type: "mob", IsStopped: true, LastAction: "На паузе" });
//     return data;
//   } catch (e) {
//     console.error(e);
//     return e;
//   }
// };

// module.exports = {
//   getInstances,
//   getServer,
//   getProfiles,
//   getPhoneGroupSets,
//   importData,
//   searchRegions,
//   createCampaing,
//   getFilteredCampaigns,
//   getGears,
//   getGifts,
//   getSimulatedAgents,
//   getGates,
//   getGazooProfiles,
//   getCampaign,
//   updateCampaign,
//   addCampaign,
// };

// class BlazorController {
//   // CLIENTS

//   async getServer(req, res, next) {
//     try {
//       const { data } = await instance.get("api/Server/");
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getInstances(req, res, next) {
//     try {
//       const { data } = await instance.get("api/Clients/GetInstances/", serviceServer);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getProfiles(req, res, next) {
//     try {
//       const { instanceId } = req.body;
//       if (!instanceId) {
//         return next(ApiError.badRequest("Укажите instanceId"));
//       }

//       const { data } = await instance.get(`api/Clients/GetProfiles/${instanceId}`, serviceServer);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getPhoneGroupSets(req, res, next) {
//     try {
//       const { data } = await instance.get("api/Clients/GetPhoneGroupSets/", serviceServer);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async importData(req, res, next) {
//     try {
//       const { instanceId, campaignId, phoneGroups, regionsIds } = req.body;
//       if (!instanceId || !campaignId || !phoneGroups || !regionsIds) {
//         return next(ApiError.badRequest("Укажите Все данные"));
//       }

//       const { data } = await instance.post("api/Clients/ImportData", {
//         server: serviceServer,
//         data: {
//           isEmergencyImport: false,
//           imports: [
//             {
//               instanceId,
//               campaignId,
//               regionsIds,
//               operatorCode: null,
//               phoneType: -1,
//               phoneGroups,
//               isImportWithoutAge: false,
//               fromAge: null,
//               toAge: null,
//               phonesActivityOption: 0,
//             },
//           ],
//         },
//       });
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async searchRegions(req, res, next) {
//     try {
//       const { query } = req.body;
//       if (!query) {
//         return next(ApiError.badRequest("Укажите query"));
//       }
//       const { data } = await instance.get("api/Clients/SearchRegions/", { server: serviceServer, limit: 25, currentPage: 1, query });
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async createCampaing(req, res, next) {
//     try {
//       const { campaignName, instanceId, profileId } = req.body;
//       if (!campaignName || !instanceId || !profileId) {
//         return next(ApiError.badRequest("Укажите все данные"));
//       }
//       const { data } = await instance.get("api/Clients/CreateCampaing/", { server: serviceServer, campaignName, instanceId, profileId });
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   // GAZOO

//   async getFilteredCampaigns(req, res, next) {
//     try {
//       const { server } = req.body;
//       if (!server) {
//         return next(ApiError.badRequest("Укажите server"));
//       }
//       const { data } = await instance.get("api/Gazoo/GetFilteredCampaigns/", server);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getGears(req, res, next) {
//     try {
//       const { server } = req.body;
//       if (!server) {
//         return next(ApiError.badRequest("Укажите server"));
//       }
//       const { data } = await instance.get("api/Gazoo/GetGears/", server);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getGifts(req, res, next) {
//     try {
//       const { server } = req.body;
//       if (!server) {
//         return next(ApiError.badRequest("Укажите server"));
//       }
//       const { data } = await instance.get("api/Gazoo/GetGifts/", server);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getSimulatedAgents(req, res, next) {
//     try {
//       const { server, profileId } = req.body;
//       if (!server || !profileId) {
//         return next(ApiError.badRequest("Укажите все данные"));
//       }
//       const { data } = await instance.get(`api/Gazoo/GetSimulatedAgents/${profileId}`, server);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getGates(req, res, next) {
//     try {
//       const { server } = req.body;
//       if (!server) {
//         return next(ApiError.badRequest("Укажите server"));
//       }
//       const { data } = await instance.get("api/Gazoo/GetGates/", server);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getGazooProfiles(req, res, next) {
//     try {
//       const { server } = req.body;
//       if (!server) {
//         return next(ApiError.badRequest("Укажите server"));
//       }
//       const { data } = await instance.get("api/Gazoo/GetProfiles/", server);
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async getCampaign(req, res, next) {
//     try {
//       const { server, campaignId } = req.body;
//       if (!server || !campaignId) {
//         return next(ApiError.badRequest("Укажите все данные"));
//       }
//       const { data } = await instance.get("api/Gazoo/GetCampaign", { server, campaignId, action: 0 });
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async updateCampaign(req, res, next) {
//     try {
//       const { server, campaign } = req.body;
//       if (!server || !campaign) {
//         return next(ApiError.badRequest("Укажите все данные"));
//       }
//       const { data } = await instance.get("api/Gazoo/UpdateCampaign", { server, campaign });
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }

//   async addCampaign(req, res, next) {
//     try {
//       const { campaignId, serverId } = req.body;
//       if (!campaignId || !serverId) {
//         return next(ApiError.badRequest("Укажите все данные"));
//       }
//       const { data } = await instance.get("api/QueueItems/", { campaignId, serverId, scenarioId: -1, type: "mob", IsStopped: true, LastAction: "На паузе" });
//       return res.json({
//         data,
//       });
//     } catch (e) {
//       console.error(e);
//       return next(ApiError.badRequest("Error"));
//     }
//   }
// }

// module.exports = new BlazorController();
