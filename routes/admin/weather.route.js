const express = require("express");
const router = express.Router();
const weatherController = require("../../controllers/admin/weather.controller");


router.get("/list", weatherController.list);
router.get("/detail/:id", weatherController.viewDetail);

module.exports = router;
