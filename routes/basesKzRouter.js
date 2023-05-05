const Router = require('express')
const router = new Router()
const basesKzController = require('../controllers/basesKzController')

router.post('/create', basesKzController.create)
router.post('/getOne', basesKzController.getOneBase)
router.post('/getForCity', basesKzController.getBasesForCity)
router.post('/changeOne', basesKzController.changeBase)
router.post('/deleteOne', basesKzController.deleteBase)
router.get('/get', basesKzController.getAll)

module.exports = router