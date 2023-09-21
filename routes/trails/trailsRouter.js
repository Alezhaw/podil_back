const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const trailsController = require("../../controllers/trails/trailsController");

router.post("/getAll", auth, trailsController.getAll);
router.post("/search", auth, trailsController.getFiltered);
router.post("/create", auth, trailsController.create);
router.post("/update", auth, trailsController.update);
//router.post("/delete", auth, trailsController.delete);

module.exports = router;
