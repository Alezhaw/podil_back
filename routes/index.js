const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const basesRouter = require("./basesRouter");
const citiesRouter = require("./citiesRouter");
const basesKzRouter = require("./basesKzRouter");
const formularzRouter = require("./formularzRouter");
const logsRouter = require("./logsRouter");

router.use("/user", userRouter);
router.use("/base", basesRouter);
router.use("/city", citiesRouter);
router.use("/basekz", basesKzRouter);
router.use("/formularz", formularzRouter);
router.use("/log", logsRouter);

module.exports = router;
