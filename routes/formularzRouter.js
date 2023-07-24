const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const formularzController = require("../controllers/formularzController");

router.post("/create", auth, formularzController.create);
router.get("/getAll", auth, formularzController.getAll);
router.get("/getActive", auth, formularzController.getActiveApplications);
router.get("/getInvalid", auth, formularzController.getInvalidApplications);

module.exports = router;
