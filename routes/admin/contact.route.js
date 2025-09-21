const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/admin/contact.controller");


router.get("/list", contactController.list);
router.get("/answer/:id", contactController.contactAnswer);
router.patch("/answer/:id", contactController.contactAnswerPatch);
module.exports = router;
