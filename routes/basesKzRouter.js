const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const basesKzController = require("../controllers/basesKzController");

router.post("/create", auth, basesKzController.create);
router.post("/getOne", auth, basesKzController.getOneBase);
router.post("/getForCity", auth, basesKzController.getBasesForCity);
router.post("/search", auth, basesKzController.getFilteredBases);
router.post("/deleteOne", auth, basesKzController.deleteBase);
router.get("/get", auth, basesKzController.getAll);

module.exports = router;
