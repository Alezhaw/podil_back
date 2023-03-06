const Router = require('express')
const router = new Router()
const userTransferToUserController = require('../controllers/userTransferToUserController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, userTransferToUserController.create)
router.post('/update', authMiddleware, userTransferToUserController.changeTransfer)
router.post('/getUsersTransfers',authMiddleware, userTransferToUserController.getUserTransfers)
router.post('/getOne', authMiddleware, userTransferToUserController.getOneTransfer)
router.get('/getAll', authMiddleware, userTransferToUserController.getAll)

module.exports = router
