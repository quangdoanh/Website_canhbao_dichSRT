const express = require("express");
const router = express.Router();
const sauromthongSRTController = require('../../controllers/admin/sauromthong.controller');


router.get("/srt/indexth", sauromthongSRTController.list);

module.exports = router;
