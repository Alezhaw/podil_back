const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const citiesKzController = require("../controllers/citiesKzController");

router.post("/create", auth, citiesKzController.create);
router.post("/getOne", auth, citiesKzController.getOneCity);
router.post("/search", auth, citiesKzController.getFilteredCities);
router.post("/changeCheck", auth, citiesKzController.changeCheck);
router.post("/deleteOne", auth, citiesKzController.deleteCity);
router.post("/deleteTime", auth, citiesKzController.deleteOneTime);
router.get("/get", citiesKzController.getAll);

module.exports = router;
