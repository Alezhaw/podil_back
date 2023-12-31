const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const projectConcentController = require("../../controllers/trails/projectConcentController");

router.post("/getAll", auth, projectConcentController.getAll);
router.post("/getByIds", auth, projectConcentController.getByIds);
router.post("/create", auth, projectConcentController.create);
router.post("/update", auth, projectConcentController.update);
router.post("/delete", auth, projectConcentController.delete);
router.post("/remove", auth, projectConcentController.remove);

module.exports = router;
