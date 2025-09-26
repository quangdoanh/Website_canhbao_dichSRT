const router = require("express").Router()

//Controllers
const mapCanhBaoControllers = require('../../controllers/client/mapcanhbao.controller')
// end Controllers

router.get('/', mapCanhBaoControllers.mapCanhBao)

module.exports = router;