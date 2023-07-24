const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const formularzController = require("../controllers/formularzController");

//router.post("/create", auth, citiesController.create);
//router.post("/getOne", auth, citiesController.getOneCity);
//router.post("/search", auth, citiesController.getFilteredCities);
//router.post("/changeCheck", auth, citiesController.changeCheck);
//router.post("/changeStatus", auth, citiesController.changeStatus);
//router.post("/deleteOne", auth, citiesController.deleteCity);
//router.post("/deleteTime", auth, citiesController.deleteOneTime);
router.get("/getAll", auth, formularzController.getAll);
router.get("/getActive", auth, formularzController.getActiveApplications);
router.get("/getInvalid", auth, formularzController.getInvalidApplications);

module.exports = router;
