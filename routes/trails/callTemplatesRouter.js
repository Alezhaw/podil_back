const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const callTemplatesController = require("../../controllers/trails/callTemplatesController");

router.post("/getAll", auth, callTemplatesController.getAll);
router.post("/getByIds", auth, callTemplatesController.getByIds);
router.post("/create", auth, callTemplatesController.create);
router.post("/update", auth, callTemplatesController.update);
router.post("/delete", auth, callTemplatesController.delete);
router.post("/remove", auth, callTemplatesController.remove);

module.exports = router;
