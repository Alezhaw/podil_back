const Router = require("express");
const router = new Router();
const auth = require("../../middleware/authMiddleware");
const filesController = require("../../controllers/blazor/filesController");

router.post("/getEUData", auth, filesController.getEUData);
router.post("/obtainCsvFile", auth, filesController.obtainCsvFile);
router.post("/importRecords", auth, filesController.importRecords);
router.post("/importCsv", auth, filesController.importCsv);

module.exports = router;
