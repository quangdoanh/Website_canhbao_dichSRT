const router = require("express").Router()

//Controllers
const contactController = require("../../controllers/client/contact.controller")
// end Controllers


router.get('/', contactController.contactList)
module.exports = router;