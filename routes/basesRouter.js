const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const basesController = require("../controllers/basesController");

router.post("/create", auth, basesController.create);
router.post("/createByTrail", auth, basesController.createByTrail);
router.post("/updateByGazoo", auth, basesController.updateByGazoo);
router.post("/getOne", auth, basesController.getOneBase);
router.post("/getForCity", auth, basesController.getBasesForCity);
router.post("/getByIds", auth, basesController.getByIdsForBase);
router.post("/search", auth, basesController.getFilteredBases);
router.post("/deleteOne", auth, basesController.deleteBase);
router.post("/get", auth, basesController.getAll);

module.exports = router;
