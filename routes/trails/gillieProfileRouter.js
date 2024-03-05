const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const gillieProfileController = require("../../controllers/trails/gillieProfileController");

router.get("/getAll", auth, gillieProfileController.getAll);
router.post("/getByIds", auth, gillieProfileController.getByIds);
router.post("/create", auth, gillieProfileController.create);
router.post("/update", auth, gillieProfileController.update);
router.post("/delete", auth, gillieProfileController.delete);
router.post("/remove", auth, gillieProfileController.remove);

module.exports = router;
