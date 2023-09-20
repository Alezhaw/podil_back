const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const reservationStatusController = require("../../controllers/trails/reservationStatusController");

router.post("/getAll", auth, reservationStatusController.getAll);
router.post("/create", auth, reservationStatusController.create);
router.post("/update", auth, reservationStatusController.update);
router.post("/delete", auth, reservationStatusController.delete);

module.exports = router;
