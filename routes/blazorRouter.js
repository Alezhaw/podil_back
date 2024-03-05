const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const clientsController = require("../controllers/blazor/clientsController");
const gazooController = require("../controllers/blazor/gazooController");
const queueController = require("../controllers/blazor/queueController");

router.get("/getServers", auth, clientsController.getServer);
router.get("/getInstances", auth, clientsController.getInstances);
router.post("/getProfiles", auth, clientsController.getProfiles);
router.get("/getPhoneGroupSets", auth, clientsController.getPhoneGroupSets);
router.post("/importData", auth, clientsController.importData);
router.post("/searchRegions", auth, clientsController.searchRegions);
router.post("/createCampaing", auth, clientsController.createCampaing);
router.post("/campaignCallingControl", auth, gazooController.campaignCallingControl);
router.post("/getFilteredCampaigns", auth, gazooController.getFilteredCampaigns);
router.post("/getGears", auth, gazooController.getGears);
router.post("/getGifts", auth, gazooController.getGifts);
router.post("/getSimulatedAgents", auth, gazooController.getSimulatedAgents);
router.post("/getGates", auth, gazooController.getGates);
router.post("/getGazooProfiles", auth, gazooController.getGazooProfiles);
router.post("/getCampaign", auth, gazooController.getCampaign);
router.post("/updateCampaign", auth, gazooController.updateCampaign);
router.post("/addCampaign", auth, queueController.addCampaign);
module.exports = router;
