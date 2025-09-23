const router = require("express").Router();
const faqController = require("../../controllers/client/faq.controller");

// /faq/:topic
router.get("/:topic", faqController.faqByTopic);

module.exports = router;