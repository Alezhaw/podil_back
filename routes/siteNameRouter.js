const Router = require('express')
const router = new Router()
const siteNameController = require('../controllers/siteNameController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, siteNameController.create)
router.post('/update', authMiddleware, siteNameController.update)
router.post('/updateWallet', authMiddleware, siteNameController.updateWallet)
router.get('/get', siteNameController.getName)
router.get('/getWallet', siteNameController.getWallet)
router.get('/getAll', authMiddleware, siteNameController.getAllNames)

module.exports = router
