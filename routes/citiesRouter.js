const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const citiesController = require("../controllers/citiesController");

router.post("/create", auth, citiesController.create);
router.post("/getOne", citiesController.getOneCity);
router.post("/changeOne", auth, citiesController.changeCity);
router.post("/changeCheck", auth, citiesController.changeCheck);
router.post("/deleteOne", auth, citiesController.deleteCity);
router.post("/deleteTime", auth, citiesController.deleteOneTime);
router.get("/get", citiesController.getAll);

module.exports = router;
