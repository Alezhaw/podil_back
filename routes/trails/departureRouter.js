const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const departureController = require("../../controllers/trails/departureController");

router.post("/getAll", auth, departureController.getAll);
router.post("/getByIds", auth, departureController.getByIds);
router.post("/getForEditing", auth, departureController.getForEditing);
router.post("/search", departureController.getFiltered);
router.post("/create", auth, departureController.create);
router.post("/update", auth, departureController.update);
router.post("/remove", auth, departureController.remove);

module.exports = router;
