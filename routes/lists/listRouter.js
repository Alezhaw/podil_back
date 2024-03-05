const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const listController = require("../../controllers/lists/listController");

router.post("/getAll", auth, listController.getAll);
router.post("/getByIds", auth, listController.getByIds);
router.post("/getByIdsForBase", auth, listController.getByIdsForBase);
router.post("/getFiltered", auth, listController.getFilteredLists);
router.post("/create", auth, listController.create);
router.post("/update", auth, listController.update);
router.post("/remove", auth, listController.remove);

module.exports = router;
