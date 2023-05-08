const Router = require('express')
const router = new Router()
const citiesKzController = require('../controllers/citiesKzController')

router.post('/create', citiesKzController.create)
router.post('/getOne', citiesKzController.getOneCity)
router.post('/changeOne', citiesKzController.changeCity)
router.post('/deleteOne', citiesKzController.deleteCity)
router.post('/deleteTime', citiesKzController.deleteOneTime)
router.get('/get', citiesKzController.getAll)

module.exports = router