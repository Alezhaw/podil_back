const Router = require('express')
const router = new Router()
const adminChatController = require('../controllers/adminChatController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, adminChatController.create)
router.post('/get', authMiddleware, adminChatController.getAdminChats)
router.post('/getOne', authMiddleware, adminChatController.getOne)
router.post('/delete', authMiddleware, adminChatController.deleteAdminChats)
router.post('/rate', authMiddleware, adminChatController.updateAdminChatRate)

module.exports = router