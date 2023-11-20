const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const citiesWithRegionsController = require("../../controllers/trails/citiesWithRegionsController");

router.post("/getAll", auth, citiesWithRegionsController.getAll);
router.post("/getByName", auth, citiesWithRegionsController.getByName);
router.post("/getByIds", auth, citiesWithRegionsController.getByIds);
router.post("/getByRegion", auth, citiesWithRegionsController.getByRegion);
router.post("/create", auth, citiesWithRegionsController.create);
router.post("/update", auth, citiesWithRegionsController.update);
router.post("/delete", auth, citiesWithRegionsController.delete);
router.post("/removeByRegion", auth, citiesWithRegionsController.removeByRegion);

module.exports = router;
