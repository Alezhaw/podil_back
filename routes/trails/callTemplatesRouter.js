const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const callTemplatesController = require("../controllers/trails/callTemplatesController");

router.post("/getAll", auth, callTemplatesController.getAll);
router.post("/create", auth, callTemplatesController.create);
router.post("/update", auth, callTemplatesController.update);
router.post("/delete", auth, callTemplatesController.delete);

module.exports = router;
