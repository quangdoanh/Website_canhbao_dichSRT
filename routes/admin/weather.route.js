const express = require("express");
const router = express.Router();
const weatherController = require("../../controllers/admin/weather.controller");


router.get("/list", weatherController.list);
router.get("/api/list", weatherController.appList);
router.get("/edit/:id", weatherController.edit);
router.get("/api/edit/:id", weatherController.appEdit);
router.patch("/edit/:id", weatherController.editPatch);
router.get("/detail/:id", weatherController.viewDetail);
router.get("/api/detail/:id", weatherController.appViewDetail);

module.exports = router;
