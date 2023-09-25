const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const formController = require("../../controllers/trails/formController");

router.post("/getAll", auth, formController.getAll);
router.post("/getByIds", auth, formController.getByIds);
router.post("/getByName", auth, formController.getByName);
router.post("/create", auth, formController.create);
router.post("/update", auth, formController.update);
//router.post("/delete", auth, formController.delete);
router.post("/remove", auth, formController.remove);

module.exports = router;
