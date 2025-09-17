const router = require("express").Router()

//Controllers
const aboutController = require("../../controllers/client/about.controller")
// end Controllers


router.get('/', aboutController.about)
module.exports = router;