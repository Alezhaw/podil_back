const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const CreateCompanyQueueController = require("../controllers/createCompanyQueueController");

router.get("/getAll", auth, CreateCompanyQueueController.getAll);
router.post("/create", auth, CreateCompanyQueueController.create);
router.post("/update", auth, CreateCompanyQueueController.update);
router.post("/delete", auth, CreateCompanyQueueController.delete);

module.exports = router;
