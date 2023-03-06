const Router = require('express')
const router = new Router()
const telegramController = require('../controllers/telegramController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/delete', telegramController.delete)
router.post('/create', telegramController.create)
router.get('/get', telegramController.getAll)

module.exports = router
