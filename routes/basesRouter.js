const Router = require('express')
const router = new Router()
const basesController = require('../controllers/basesController')

router.post('/create', basesController.create)
router.post('/getOne', basesController.getOneBase)
router.post('/getForCity', basesController.getBasesForCity)
router.post('/changeOne', basesController.changeBase)
router.post('/deleteOne', basesController.deleteBase)
router.get('/get', basesController.getAll)

module.exports = router