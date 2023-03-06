const Router = require('express')
const router = new Router()

router.get('/', (req, res) => {
    res.send('test chat')
})

module.exports = router
