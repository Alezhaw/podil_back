const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const basesKzController = require("../controllers/basesKzController");

router.post("/create", auth, basesKzController.create);
router.post("/getOne", basesKzController.getOneBase);
router.post("/getForCity", basesKzController.getBasesForCity);
router.post("/changeOne", auth, basesKzController.changeBase);
router.post("/deleteOne", auth, basesKzController.deleteBase);
router.get("/get", basesKzController.getAll);

module.exports = router;
