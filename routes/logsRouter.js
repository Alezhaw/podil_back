const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const logsController = require("../controllers/logsController");

router.get("/getCities", auth, logsController.getAllCitiesLog);
router.post("/searchCity", auth, logsController.getFilteredLogsCities);
router.get("/getBases", auth, logsController.getAllBasesLog);
router.post("/searchBase", auth, logsController.getFilteredLogsBases);

module.exports = router;
