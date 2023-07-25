const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const formularzController = require("../controllers/formularzController");

router.post("/create", formularzController.create);
router.get("/getAll", formularzController.getAll);
router.get("/getActive", formularzController.getActiveApplications);
router.get("/getInvalid", formularzController.getInvalidApplications);
router.get("/newScript", formularzController.updateNewScriptParametr);

module.exports = router;
