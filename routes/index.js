const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const basesRouter = require("./basesRouter");
const citiesRouter = require("./citiesRouter");
const basesKzRouter = require("./basesKzRouter");
const citiesKzRouter = require("./citiesKzRouter");
const logsRouter = require("./logsRouter");

router.use("/user", userRouter);
router.use("/base", basesRouter);
router.use("/city", citiesRouter);
router.use("/basekz", basesKzRouter);
router.use("/citykz", citiesKzRouter);
router.use("/log", logsRouter);

module.exports = router;
