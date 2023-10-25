const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/change", authMiddleware, userController.changeUser);
router.post("/increaseScore", authMiddleware, userController.increaseUserScore);
router.post("/decreaseScore", authMiddleware, userController.decreaseUserScore);
// router.post('/delete', authMiddleware, userController.deleteUsers)
router.post("/remove", authMiddleware, userController.removeUsers);
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/nickname", authMiddleware, userController.changeNickname);
router.post("/password", authMiddleware, userController.changePassword);
router.post("/role", authMiddleware, userController.changeRole);
router.post("/score", authMiddleware, userController.changeScore);
router.post("/message", authMiddleware, userController.changeSystemMessage);
router.post("/messageAtUser", authMiddleware, userController.changeSystemMessageAtUser);
router.post("/completed", authMiddleware, userController.changeCompleted);
router.post("/checkRu", authMiddleware, userController.changeCheckRu);
router.post("/checkRuUser", authMiddleware, userController.changeCheckRuUser);
router.post("/transferAmount", authMiddleware, userController.changeTransferAmount);
router.get("/auth", authMiddleware, userController.check);
router.get("/get", authMiddleware, userController.getAllUsers);

module.exports = router;
