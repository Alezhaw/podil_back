const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const planningPersonController = require("../../controllers/trails/planningPersonController");

router.post("/getAll", auth, planningPersonController.getAll);
router.post("/getByIds", auth, planningPersonController.getByIds);
router.post("/create", auth, planningPersonController.create);
router.post("/update", auth, planningPersonController.update);
router.post("/delete", auth, planningPersonController.delete);
router.post("/remove", auth, planningPersonController.remove);

module.exports = router;
