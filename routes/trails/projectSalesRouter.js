const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const projectSalesController = require("../../controllers/trails/projectSalesController");

router.post("/getAll", auth, projectSalesController.getAll);
router.post("/getByIds", auth, projectSalesController.getByIds);
router.post("/create", auth, projectSalesController.create);
router.post("/update", auth, projectSalesController.update);
router.post("/delete", auth, projectSalesController.delete);
router.post("/remove", auth, projectSalesController.remove);

module.exports = router;
