const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const presentationTimeController = require("../../controllers/trails/presentationTimeController");

router.post("/getAll", auth, presentationTimeController.getAll);
router.post("/create", auth, presentationTimeController.create);
router.post("/update", auth, presentationTimeController.update);
router.post("/delete", auth, presentationTimeController.delete);

module.exports = router;
