const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const ServersQueueController = require("../controllers/serversQueueController");

router.get("/getAll", auth, ServersQueueController.getAll);
router.post("/getByCountry", auth, ServersQueueController.getByCountry);
router.post("/create", auth, ServersQueueController.create);
router.post("/increase", auth, ServersQueueController.increaseCompanyCount);
router.post("/update", auth, ServersQueueController.update);
router.post("/delete", auth, ServersQueueController.delete);

module.exports = router;
