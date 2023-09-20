const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const basesRouter = require("./basesRouter");
const citiesRouter = require("./citiesRouter");
const formularzRouter = require("./formularzRouter");
const logsRouter = require("./logsRouter");
const speakerTemplateRouter = require("./speakerTemplateRouter");
const regionsRouter = require("./trails/regionsRouter");
const citiesWithRegionsRouter = require("./trails/citiesWithRegionsRouter");

router.use("/user", userRouter);
router.use("/base", basesRouter);
router.use("/city", citiesRouter);
router.use("/formularz", formularzRouter);
router.use("/log", logsRouter);
router.use("/speakerTemplate", speakerTemplateRouter);
router.use("/region", regionsRouter);
router.use("/cityWithReg", citiesWithRegionsRouter);

module.exports = router;
