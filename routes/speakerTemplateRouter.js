const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const speakerTemplatesontroller = require("../controllers/speakerTemplatesontroller");

router.get("/getAll", auth, speakerTemplatesontroller.getAllTemplates);
router.get("/getTypes", auth, speakerTemplatesontroller.getTypes);
router.post("/create", auth, speakerTemplatesontroller.create);
router.post("/update", auth, speakerTemplatesontroller.update);
router.post("/getByType", auth, speakerTemplatesontroller.getByType);
router.post("/delete", auth, speakerTemplatesontroller.delete);

module.exports = router;
