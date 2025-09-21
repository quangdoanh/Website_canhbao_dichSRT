const express = require("express");
const router = express.Router();
const sauromthongSRTController = require('../../controllers/admin/sauromthong.controller');


router.get('/dulieusrt/:matinh/list', sauromthongSRTController.listDulieuSRT);
router.get('/dulieusrt/:matinh/create', sauromthongSRTController.createDulieuSRT);
router.get('/dulieusrt/:matinh/edit/:id', sauromthongSRTController.editDulieuSRT);
router.patch('/dulieusrt/:matinh/edit/:id', sauromthongSRTController.editPatchDulieuSRT);

module.exports = router;
