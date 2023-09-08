const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const basesRouter = require("./basesRouter");
const citiesRouter = require("./citiesRouter");
const formularzRouter = require("./formularzRouter");
const logsRouter = require("./logsRouter");
const speakerTemplateRouter = require("./speakerTemplateRouter");

router.use("/user", userRouter);
router.use("/base", basesRouter);
router.use("/city", citiesRouter);
router.use("/formularz", formularzRouter);
router.use("/log", logsRouter);
router.use("/speakerTemplate", speakerTemplateRouter);

module.exports = router;
