const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const trailsController = require("../../controllers/trails/trailsController");

router.post("/getAll", auth, trailsController.getAll);
router.post("/getByIds", auth, trailsController.getByIds);
router.post("/search", auth, trailsController.getFiltered);
router.post("/create", auth, trailsController.create);
router.post("/update", auth, trailsController.update);
router.post("/getDictionaries", auth, trailsController.getDictionaryByTrails);
//router.post("/delete", auth, trailsController.delete);
router.post("/remove", auth, trailsController.remove);

module.exports = router;
