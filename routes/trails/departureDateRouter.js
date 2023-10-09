const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const departureDateController = require("../../controllers/trails/departureDateController");

router.post("/getAll", auth, departureDateController.getAll);
router.post("/getByIds", auth, departureDateController.getByIds);
router.post("/getByDepartureIds", auth, departureDateController.getByDepartureIds);
router.post("/create", auth, departureDateController.create);
router.post("/update", auth, departureDateController.update);
router.post("/remove", auth, departureDateController.remove);

module.exports = router;
