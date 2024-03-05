const { CreateCompanyQueue } = require("../models/createCompanyQueueModels");
const Blazor = require("../api/blazor.js");
const TrailsService = require("../services/trails/trailsService.js");
const CityService = require("../services/CityService.js");
const CitiesWithRegService = require("../services/trails/citiesWithRegionsService.js");
const FormService = require("../services/trails/formService.js");
const GillieProfileService = require("../services/trails/gillieProfileService.js");
const BaseService = require("../services/baseService.js");
const TrailsController = require("../controllers/trails/trailsController.js");
const { ServersQueue } = require("../models/serversQueueModels");

function getValueById(id, key, array) {
  if (!id) {
    return "";
  }
  const item = array?.filter((item) => item.id === Number(id))[0];
  return item ? item[key] : "";
}

function setServersProorityProperties(servers, serversQueue, busy) {
  return servers?.map((el) => ({ ...el, count: serversQueue?.find((item) => item?.url === el?.url)?.companyCount || 0, busy }));
}

async function getServer(profile) {
  const result = await Promise.all([await Blazor.getInstance(), await Blazor.getServers()]);
  let instances = result[0];
  let tempServers = result[1];
  tempServers = tempServers?.map((el) => ({ ...el, instance: instances.find((item) => el?.url === item.ApiAddress) }))?.filter((el) => el.instance);
  tempServers = tempServers?.filter((el) => !!profile?.servers_url?.find((url) => url === el?.url));
  return { servers: tempServers, allServers: result[1], instances };
}

async function getEmptyServer(servers, trail) {
  let serversArray = [];
  const chunkSize = 10; //поставить 5-10
  for (let i = 0; i < servers.length; i += chunkSize) {
    const chunk = servers.slice(i, i + chunkSize);
    serversArray.push(chunk);
  }
  let emptyServers = [];
  let busyServers = [];
  for (let i = 0; i < serversArray.length; i++) {
    const result = await Promise.all(serversArray[i].map(async (el) => ({ ...el, filteredCampaigns: await Blazor.getFilteredCampaigns(el) })));
    const servers = result
      //?.filter((el) => el?.accountId === "65984c3c911d624fef981cdf")
      .filter((el) => !el?.filteredCampaigns?.responseData?.find((el) => el?.status === 1) && el?.filteredCampaigns?.responseData);
    const serversUrl = servers?.map((el) => el?.url);
    const serversWithCampaign = result.filter((el) => el?.filteredCampaigns?.responseData && !serversUrl?.includes(el.url));
    if (servers[0]) {
      emptyServers.push(...servers);
    }
    if (serversWithCampaign[0]) {
      busyServers.push(...serversWithCampaign);
    }
    const serversQueue = await ServersQueue.findAll({ where: { country: trail?.country } });
    emptyServers = setServersProorityProperties(emptyServers, serversQueue, false);
    busyServers = setServersProorityProperties(busyServers, serversQueue, true);
    emptyServers = [...emptyServers, ...busyServers]?.sort((a, b) => a.count - b.count || a.busy - b.busy || String(a?.name)?.localeCompare(String(b?.name)));
  }
  return emptyServers;
}

async function getRegionIds(trail, currentTrail) {
  const trailCity = await CitiesWithRegService?.getById(trail?.country, currentTrail?.dataValues.city_id);
  const autozonningArray = trailCity?.dataValues?.autozonning;
  if (autozonningArray) {
    const currentAutozonning = autozonningArray?.filter((el) => String(el).toLowerCase()?.includes(String(currentTrail?.dataValues?.autozonning).toLowerCase()));
    let manyParts = currentAutozonning?.filter(
      (el) =>
        String(el).toLowerCase()?.includes(String(currentTrail?.dataValues?.autozonning).toLowerCase()) && String(el).toLowerCase() !== String(currentTrail?.dataValues?.autozonning).toLowerCase()
    );
    if (manyParts[0]) {
      manyParts = await Promise.all(manyParts?.map(async (el) => ({ name: el, autozonning: await Blazor.searchRegions(el) })));
      if (manyParts && manyParts[0] && manyParts[0]?.autozonning?.TotalCount) {
        let regions = manyParts?.map((region) => region?.autozonning?.Data?.find((el) => String(el?.RegionName).trim() === String(region?.name).trim()));
        if (!regions || !regions[0]) {
          return;
        }
        return regions;
      }
    } else {
      console.log("regionIds current", currentAutozonning);
      let regions = await Blazor.searchRegions(currentTrail?.dataValues?.autozonning);
      if (!regions?.TotalCount) {
        return;
      }
      regions = regions?.Data?.find((el) => String(el?.RegionName).trim() === String(currentTrail?.dataValues?.autozonning).trim());
      if (!regions) {
        return;
      }

      return [regions];
    }
  } else {
    return console.log("Get autozonning error");
  }

  let regions = await Blazor.searchRegions(trail?.autozonning);
  if (!regions?.TotalCount) {
    return;
  }
  regions = regions?.Data?.find((el) => String(el?.RegionName).trim() === String(trail?.autozonning).trim());
  if (!regions) {
    return;
  }
  return [regions?.Id];
}

async function getParametersFromServer(emptyServer) {
  const profiles = await Blazor.getProfiles(emptyServer?.instance?.Id);

  let gears = await Blazor.getGears(emptyServer);
  if (!gears) {
    gears = [];
  }

  let gates = await Blazor.getGates(emptyServer);
  if (!gates) {
    gates = [];
  }
  gates = gates?.map((el) => el?.gateConfigurationModel?.gateId);

  const gifts = await Blazor.getGifts(emptyServer);

  return { profiles, gears, gates, gifts };
}

async function createCampaignWithCustomServers({ region, emptyServer, trail, currentTrail, allServers, instances, phoneGroupSets, currentProfile }) {
  if (!emptyServer) {
    return console.log("Campaign create error: all servers are busy");
  }
  const result = await getParametersFromServer(emptyServer);
  if (!result) {
    return console.log("Error get data from gazoo server");
  }
  const { profiles, gears, gates, gifts } = result;

  const simulatedAgents = await Blazor.getSimulatedAgents(
    emptyServer,
    (profiles?.find((el) => String(el.Name).toLowerCase() === String(currentProfile?.profile_name)?.toLowerCase()) || profiles[0])?.Id
  );
  if (!simulatedAgents || !simulatedAgents[0]) {
    return console.log("Campaign create error: Simulated agents not found");
  }

  if (!profiles || !profiles[0]) {
    return console.log("Campaign create error: Error getting profiles");
  }
  if (!gears || !gears[0]) {
    return console.log("Campaign create error: Error getting gears");
  }
  if (!gates || !gates[0]) {
    return console.log("Campaign create error: Error getting gates");
  }
  if (!gifts || !gifts[0]) {
    return console.log("Campaign create error: Error getting gifts");
  }
  if (!simulatedAgents || !simulatedAgents[0]) {
    return customAlert({ message: "Simulated agents not found" });
  }

  // const newCampaing = {
  //   ExternalId: 2509,
  //   Id: 195333,
  //   InstanceId: 71,
  //   Name: `${getValueById(trail.regionId, "timezone", allDictionary?.regions)} ${getValueById(trail.city_id, "city_name", allCitiesWithRegions)} ${trail?.presentation_date} ${
  //     getValueById(trail.form_id, "local", forms) || getValueById(trail.form_id, "local", allForms)
  //   }`,
  // };
  const newCampaing = await Blazor.createCampaing(
    trail?.name,
    emptyServer?.instance?.Id,
    profiles?.find((el) => String(el?.Name).toLowerCase() === String(currentProfile?.profile_name).toLowerCase())?.id || profiles[0]?.Id
  );
  if (!newCampaing?.Id) {
    return console.log("Campaign create error: Error creating campaign");
  }

  let checkServersQueue = await ServersQueue.findOne({ where: { url: emptyServer?.url, country: trail?.country } });
  if (!checkServersQueue) {
    try {
      checkServersQueue = await ServersQueue.create({ url: emptyServer?.url, country: trail?.country, name: emptyServer?.name, companyCount: 1 });
    } catch (e) {
      console.log("Campaign create error: Error creating servers queue");
    }
  }
  await ServersQueue.update({ companyCount: checkServersQueue?.dataValues?.companyCount + 1 }, { where: { id: checkServersQueue?.dataValues?.id } });

  const importData = await Blazor.importData(
    newCampaing?.InstanceId,
    newCampaing?.Id,
    phoneGroupSets?.find((el) => String(el?.Name)?.toLowerCase() === "cyrki pl od mm" || phoneGroupSets[0])?.PhoneGroupIds,
    [region?.Id]
  );

  let campaignWithProperty = await Blazor.getCampaign(emptyServer, newCampaing?.ExternalId);
  if (!campaignWithProperty) {
    return console.log(`Campaign create error: Campaign to update settings not found, server: ${emptyServer?.instance?.Name || "Get server name error"}, id: ${newCampaing?.ExternalId}`);
  }

  let campaignDateArray = currentTrail?.dataValues?.presentation_date?.split("-");
  const campaignDate = new Date(currentTrail?.dataValues?.presentation_date);
  campaignDateArray = campaignDateArray && !!campaignDateArray[0] ? new Date(`${campaignDateArray[0]}-${campaignDateArray[2]}-${campaignDateArray[1]}`) : campaignDateArray;
  campaignWithProperty = {
    ...campaignWithProperty,
    botCount: currentProfile?.bots || 50,
    date: campaignDate || trail?.presentation_date,
    gates,
    dialerGearId: (
      gears?.find((el) => String(el?.Name).toLowerCase() === String(currentProfile?.gears).toLowerCase()) ||
      gears?.find((el) => String(el?.name).toLowerCase() === "full conversation") ||
      gears[0]
    )?.id,
    simulatedAgents: simulatedAgents?.filter((el) => String(el).toLowerCase() === String(currentProfile?.simulated_agent).toLowerCase()),
    gift: gifts?.find((el) => String(el).toLowerCase() === String(currentProfile?.present).toLowerCase()) || gifts[0],
    profileId: (profiles?.find((el) => String(el?.Name).toLowerCase() === String(currentProfile?.profile_name).toLowerCase()) || profiles[0])?.Id,
  };

  const updatedCompaign = await Blazor.updateCampaign(emptyServer, campaignWithProperty);
  const resultUpdateTrail = await TrailsService.update({
    country: trail?.country,
    trail: { ...currentTrail?.dataValues, gazooServerId: emptyServer?.id, gazooCampaignId: newCampaing?.ExternalId },
  });

  if (!resultUpdateTrail) {
    console.log("Campaign create error: Error update trail company");
  }

  const serverForGazooCompany = allServers?.find((el) => el?.id === emptyServer?.id);
  const serverNameWithCampaign = instances?.find((el) => el?.ApiAddress === serverForGazooCompany?.url)?.Name;
  const checkCity = await CityService.GetTimeByTrailIdAndScheme(trail?.trailId, null, trail?.country);
  if (!checkCity) {
    try {
      const allDictionary = await TrailsController.getAllDictionaryForQueue(trail?.country);
      if (allDictionary) {
        const currentTrail = currentTrail?.dataValues;
        let cities = getValueById(currentTrail.presentation_time_id, "presentation_hour", allDictionary.presentationTimes) || [];
        const trailCity = await CitiesWithRegService?.getById(trail?.country, currentTrail?.city_id);
        const trailForm = await FormService?.getById(trail?.country, currentTrail?.form_id);
        cities = cities?.map((item) => {
          let city = {
            time: String(item)?.replaceAll("*", ""),
            calling_scheme,
            l_p_for_pl: trail?.country !== "PL" ? null : getValueById(currentTrail.company_id, "name", allDictionary?.regiments),
            region: getValueById(currentTrail.regionId, "region", allDictionary?.regions),
            timezone: getValueById(currentTrail.regionId, "timezone", allDictionary?.regions),
            city_lokal: trailCity?.city_name,
            adress: trailForm?.address,
            institution: trailForm?.local,
            date: currentTrail.presentation_date,
            population: trailCity?.population,
            project: getValueById(currentTrail.project_sales_id, "name", allDictionary?.projectSales),
            present: getValueById(currentTrail.project_concent_id, "name", allDictionary?.projectConcent),
            trailId: currentTrail.id,
            departureId: currentTrail.departure_id,
            departure_date_id: currentTrail.departure_date_id,
            check_base: false,
            check_speaker: false,
            check_scenario: false,
          };
          return city;
        });
        const result = await Podzial.createCitiesByTrails({ cities, country, status: {} });
        if (result[0]) {
          console.log("Campaign create: Create city success");
        }
      } else {
        console.log("Campaign create error: Error create city, allDictionary");
      }
    } catch (e) {
      console.log("Campaign create error: Error create city", e);
    }
  }
  const base = await BaseService.CreateByTrail({
    base: {
      podzial_id: `${newCampaing?.ExternalId} (${serverNameWithCampaign})`,
      type: region?.RegionName,
      gazooServerId: emptyServer?.id,
      gazooCampaignId: newCampaing?.ExternalId,
    },
    country: trail?.country,
    trailId: trail?.trailId,
  });
  if (base?.bases && base?.bases[0]) {
    console.log(`Company added to podzial`);
  } else {
    console.log(`Error adding company to podzial`);
  }

  console.log("create company", `The company was created on the ${emptyServer?.instance?.Name || "Get server name error"} server, id: ${newCampaing?.ExternalId}`);
  let date = null;
  try {
    date = campaignDate?.toISOString()?.split("T")[0];
    date = date?.split("-");
    date = `${date[2]}.${date[1]}`;
  } catch (e) {
    console.log(e);
    date = trail?.presentation_date;
  }

  // const addCampaign = await Blazor.addCampaign(
  //   newCampaing?.ExternalId,
  //   emptyServer?.id,
  //   trail?.name,
  //   new Date(`${campaignDateArray[0]}-${campaignDateArray[2]}-${campaignDateArray[1]}`) || new Date()
  // );
  if (!updatedCompaign) {
    console.log(` The company was created on the ${emptyServer?.instance?.Name || "Get server name error"} server, id: ${newCampaing?.ExternalId}`);
  }

  return updatedCompaign;
}

class QueueHelper {
  constructor() {}

  static async createCampaign() {
    let companyQueue = await CreateCompanyQueue.findAll();
    if (companyQueue[0]) {
      try {
        const phoneGroupSets = await Blazor.getPhoneGroupSets();
        if (!phoneGroupSets || !phoneGroupSets[0]) {
          return console.log("Campaign create error: PhoneGroupSets not found");
        }

        for (let [index, trail] of companyQueue.entries()) {
          trail = trail.dataValues;
          const currentProfile = await GillieProfileService.getById(trail?.profileId);
          if (!currentProfile) {
            return console.log("Campaign create error: Profile not found");
          }
          const { servers, allServers, instances } = await getServer(currentProfile);
          if (!servers || !servers[0]) {
            return console.log("Campaign create error: Servers not found");
          }
          const emptyServers = await getEmptyServer(servers, trail);
          if (!emptyServers[0]) {
            return console.log("Campaign create error: all servers are busy");
          }
          const currentTrail = await TrailsService.getById(trail?.country, trail?.trailId);
          const regionsIds = await getRegionIds(trail, currentTrail);
          if (!regionsIds || !regionsIds[0]) {
            return console.log("Campaign create error: Autozonning not found");
          }

          if (regionsIds?.length > 1) {
            const result = await Promise.all(
              regionsIds?.map(async (region, index) => {
                const currentServer = emptyServers[index % emptyServers?.length];

                return await createCampaignWithCustomServers({ region, emptyServer: currentServer, trail, currentTrail, allServers, instances, phoneGroupSets, currentProfile });
              })
            );
            if (result && !result[0]) {
              await CreateCompanyQueue.destroy({
                where: { id: trail?.id },
              });
            }
          } else {
            const result = await createCampaignWithCustomServers({ region: regionsIds[0], emptyServer: currentServer, trail, currentTrail, allServers, instances, phoneGroupSets, currentProfile });
            if (!result) {
              await CreateCompanyQueue.destroy({
                where: { id: trail?.id },
              });
            }
          }

          // let currentEmptyServer = index === 0 ? emptyServers[0] : await getEmptyServer(servers, trail);
          // if (!currentEmptyServer) {
          //   return console.log("Campaign create error: all servers are busy");
          // }

          // const { profiles, gears, gates, gifts } = await getParametersFromServer(currentEmptyServer);
          // if (!profiles || !profiles[0]) {
          //   return console.log("Campaign create error: Error getting profiles");
          // }
          // if (!gears || !gears[0]) {
          //   return console.log("Campaign create error: Error getting gears");
          // }
          // if (!gates || !gates[0]) {
          //   return console.log("Campaign create error: Error getting gates");
          // }
          // if (!gifts || !gifts[0]) {
          //   return console.log("Campaign create error: Error getting gifts");
          // }
          // const simulatedAgents = await Blazor.getSimulatedAgents(
          //   currentEmptyServer,
          //   (profiles?.find((el) => String(el.Name).toLowerCase() === String(currentProfile?.profile_name)?.toLowerCase()) || profiles[0])?.Id
          // );
          // if (!simulatedAgents || !simulatedAgents[0]) {
          //   return console.log("Campaign create error: Simulated agents not found");
          // }
          // const newCampaing = {
          //   ExternalId: 2487,
          //   Id: 194981,
          //   InstanceId: 71,
          //   Name: "-1 WARSZAWA - MIASTO I OKOLICA [1] P test2",
          // };
          // const newCampaing = await Blazor.createCampaing(
          //   trail?.name,
          //   emptyServer?.instance?.Id,
          //   profiles?.find((el) => String(el?.Name).toLowerCase() === String(currentProfile?.profile_name).toLowerCase())?.id || profiles[0]?.Id
          // );
          // if (!newCampaing?.Id) {
          //   return console.log("Campaign create error: Error creating campaign");
          // }

          // const importData = await Blazor.importData(
          //   newCampaing?.InstanceId,
          //   newCampaing?.Id,
          //   phoneGroupSets?.find((el) => String(el?.Name)?.toLowerCase() === "cyrki pl od mm")?.PhoneGroupIds,
          //   regionsIds
          // );

          // let campaignWithProperty = await Blazor.getCampaign(currentEmptyServer, newCampaing?.ExternalId);
          // if (!campaignWithProperty) {
          //   return console.log(
          //     `Campaign create error: Campaign to update settings not found, server: ${currentEmptyServer?.instance?.Name || "Get server name error"}, id: ${newCampaing?.ExternalId}`
          //   );
          // }
          // let campaignDateArray = trail?.presentation_date?.split("-");
          // const campaignDate = new Date(trail?.presentation_date);
          // campaignDateArray = campaignDateArray && !!campaignDateArray[0] ? new Date(campaignD`${campaignDateArray[0]}-${campaignDateArray[2]}-${campaignDateArray[1]}`) : campaignDateArray;
          // campaignWithProperty = {
          //   ...campaignWithProperty,
          //   botCount: 50,
          //   date: campaignDate || trail?.presentation_date,
          //   gates,
          //   dialerGearId: (
          //     gears?.find((el) => String(el?.Name).toLowerCase() === String(currentProfile?.gears).toLowerCase()) ||
          //     gears?.find((el) => String(el?.name).toLowerCase() === "full conversation") ||
          //     gears[0]
          //   )?.id,
          //   simulatedAgents: simulatedAgents?.filter((el) => String(el).toLowerCase() === String(currentProfile?.simulated_agent).toLowerCase()),
          //   gift: gifts?.find((el) => String(el).toLowerCase() === String(currentProfile?.present).toLowerCase()) || gifts[0],
          //   profileId: (profiles?.find((el) => String(el?.Name).toLowerCase() === String(currentProfile?.profile_name).toLowerCase()) || profiles[0])?.Id,
          // };
          // const updatedCompaign = await Blazor.updateCampaign(currentEmptyServer, campaignWithProperty);
          // const resultUpdateTrail = await TrailsService.update({
          //   country: trail?.country,
          //   trail: { ...currentTrail?.dataValues, gazooServerId: currentEmptyServer?.id, gazooCampaignId: newCampaing?.ExternalId },
          // });
          // if (!resultUpdateTrail) {
          //   console.log("Campaign create error: Error update trail company");
          // }
          // const serverForGazooCompany = allServers?.find((el) => el?.id === emptyServer?.id);
          // const serverNameWithCampaign = instances?.find((el) => el?.ApiAddress === serverForGazooCompany?.url)?.Name;
          // const base = await BaseService.CreateByTrail({
          //   base: {
          //     podzial_id: `${newCampaing?.ExternalId} (${serverNameWithCampaign})`,
          //     type: trail?.autozonning,
          //     gazooServerId: emptyServer?.id,
          //     gazooCampaignId: newCampaing?.ExternalId,
          //   },
          //   country: trail?.country,
          //   trailId: trail?.trailId,
          // });
          // if (base?.bases && base?.bases[0]) {
          //   console.log(`Company added to podzial`);
          // } else {
          //   console.log(`Error adding company to podzial`);
          // }

          // if (!updatedCompaign) {
          //   console.log(` The company was created on the ${currentEmptyServer?.instance?.Name || "Get server name error"} server, id: ${newCampaing?.ExternalId}`);
          //   // await CreateCompanyQueue.destroy({
          //   //   where: { id: trail?.id },
          //   // });
          // }

          // const addCampaign = await Blazor.addCampaign(
          //   newCampaing?.ExternalId,
          //   emptyServer?.id,
          //   trail?.name,
          //   new Date(`${campaignDateArray[0]}-${campaignDateArray[2]}-${campaignDateArray[1]}`) || new Date()
          // );
        }
      } catch (e) {
        console.log("Campaign create queue", e);
      }
    } else {
      console.log("Campaign create queue is empty");
    }
  }
}

module.exports = QueueHelper;
