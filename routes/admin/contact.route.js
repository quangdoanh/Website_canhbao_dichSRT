const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/admin/contact.controller");


router.get("/list", contactController.list);
router.get("/answer/:id", contactController.contactAnswer);
router.patch("/answer/:id", contactController.contactAnswerPatch);
router.patch("/change-public/:id", contactController.togglePublic);
router.patch("/change-multi", contactController.changeMulti);
module.exports = router;
