const router = require("express").Router()

//Controllers
const mapGiamSatControllers = require('../../controllers/client/mapgiamsat.controller')
// end Controllers

router.get('/', mapGiamSatControllers.mapGiamSat)

module.exports = router;