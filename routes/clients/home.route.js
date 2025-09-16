const router = require("express").Router()

//Controllers
const homeController = require("../../controllers/client/home.controller")
// end Controllers


router.get('/', homeController.home)
router.post('/polygons', homeController.homeSavePolygon)
router.delete('/polygons/:id', homeController.homeDeletePolygon)

module.exports = router;