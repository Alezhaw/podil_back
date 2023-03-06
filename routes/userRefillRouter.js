const Router = require('express')
const router = new Router()
const userRefillController = require('../controllers/userRefillController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/delete', authMiddleware, userRefillController.deleteRefill)
router.post('/create', authMiddleware, userRefillController.create)
router.post('/update', authMiddleware, userRefillController.changeRefill)
router.post('/getUsersRefills',authMiddleware, userRefillController.getUserRefill)
router.post('/getOne', authMiddleware, userRefillController.getOneRefill)
router.get('/getAll', authMiddleware, userRefillController.getAll)

module.exports = router
