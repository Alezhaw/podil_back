const Router = require('express')
const router = new Router()
const dealMessageController = require('../controllers/dealMessageController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, dealMessageController.create)
router.post('/getDealMessages', authMiddleware, dealMessageController.getDealMessages)

module.exports = router
