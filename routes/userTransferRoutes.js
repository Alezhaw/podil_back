const Router = require('express')
const router = new Router()
const userTransferController = require('../controllers/userTransferController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, userTransferController.create)
router.post('/update', authMiddleware, userTransferController.changeTransfer)
router.post('/getUsersTransfers',authMiddleware, userTransferController.getUserTransfers)
router.post('/getOne', authMiddleware, userTransferController.getOneTransfer)
router.get('/getAll', authMiddleware, userTransferController.getAll)

module.exports = router
