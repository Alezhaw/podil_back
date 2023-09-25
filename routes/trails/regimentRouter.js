const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const regimentController = require("../../controllers/trails/regimentController");

router.post("/getAll", auth, regimentController.getAll);
router.post("/create", auth, regimentController.create);
router.post("/update", auth, regimentController.update);
router.post("/delete", auth, regimentController.delete);
router.post("/remove", auth, regimentController.remove);

module.exports = router;
