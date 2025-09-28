const express = require("express");
const router = express.Router();
const locationController = require("../../controllers/admin/location.controller");


router.get("/api", locationController.list);

module.exports = router;