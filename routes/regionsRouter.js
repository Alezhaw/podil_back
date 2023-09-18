const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const regionsController = require("../controllers/trails/regionsController");

router.post("/getAll", auth, regionsController.getAll);
router.post("/getByIds", auth, regionsController.getByIds);
router.post("/create", auth, regionsController.create);
router.post("/update", auth, regionsController.update);
router.post("/delete", auth, regionsController.delete);

module.exports = router;
