const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const basesController = require("../controllers/basesController");

router.post("/create", auth, basesController.create);
router.post("/getOne", basesController.getOneBase);
router.post("/getForCity", basesController.getBasesForCity);
router.post("/search", basesController.getFilteredBases);
router.post("/changeOne", auth, basesController.changeBase);
router.post("/deleteOne", auth, basesController.deleteBase);
router.get("/get", basesController.getAll);

module.exports = router;
