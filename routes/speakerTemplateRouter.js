const Router = require("express");
const router = new Router();
const auth = require("../middleware/authMiddleware");
const SpeakerTemplateController = require("../controllers/speakerTemplatesСontroller");

router.get("/getAll", auth, SpeakerTemplateController.getAllTemplates);
router.get("/getTypes", auth, SpeakerTemplateController.getTypes);
router.post("/create", auth, SpeakerTemplateController.create);
router.post("/update", auth, SpeakerTemplateController.update);
router.post("/getByType", auth, SpeakerTemplateController.getByType);
router.post("/delete", auth, SpeakerTemplateController.delete);

module.exports = router;
