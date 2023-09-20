const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const contactStatusController = require("../../controllers/trails/contactStatusController");

router.post("/getAll", auth, contactStatusController.getAll);
router.post("/create", auth, contactStatusController.create);
router.post("/update", auth, contactStatusController.update);
router.post("/delete", auth, contactStatusController.delete);

module.exports = router;
