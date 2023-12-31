const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const contactStatusController = require("../../controllers/trails/contactStatusController");

router.post("/getAll", auth, contactStatusController.getAll);
router.post("/getByIds", auth, contactStatusController.getByIds);
router.post("/create", auth, contactStatusController.create);
router.post("/update", auth, contactStatusController.update);
router.post("/delete", auth, contactStatusController.delete);
router.post("/remove", auth, contactStatusController.remove);

module.exports = router;
