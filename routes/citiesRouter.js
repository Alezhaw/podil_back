const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const citiesController = require("../controllers/citiesController");

router.post("/create", auth, citiesController.create);
router.post("/getOne", auth, citiesController.getOneCity);
router.post("/search", auth, citiesController.getFilteredCities);
router.post("/changeCheck", auth, citiesController.changeCheck);
router.post("/changeStatus", auth, citiesController.changeStatus);
router.post("/deleteOne", auth, citiesController.deleteCity);
router.post("/deleteTime", auth, citiesController.deleteTime);
router.post("/get", auth, citiesController.getAll);
router.post("/test", citiesController.test);
router.get("/fixDate", citiesController.fixDate);
module.exports = router;
