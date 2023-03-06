const Router = require('express')
const router = new Router()
const messageToAdminController = require('../controllers/messageToAdminController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, messageToAdminController.create)
router.post('/createForAdmin', authMiddleware, messageToAdminController.createForAdmin)
router.post('/get', authMiddleware, messageToAdminController.getMessagesToAdmin)

module.exports = router
