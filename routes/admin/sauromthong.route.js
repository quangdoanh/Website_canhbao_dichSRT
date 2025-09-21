const express = require("express");
const router = express.Router();
const sauromthongSRTController = require('../../controllers/admin/sauromthong.controller');


router.get("/srt/indexth", sauromthongSRTController.list);
router.get('/dieutrasrt/:matinh/list',sauromthongSRTController.listDieuTraSrt)
router.get('/dieutrasrt/:matinh/create', sauromthongSRTController.createDieuTraSrt);
router.post('/dieutrasrt/:matinh/create', sauromthongSRTController.createDieuTraSrtPost);
router.get('/dieutrasrt/:matinh/edit/:id', sauromthongSRTController.editDieuTraSrt);
router.patch('/dieutrasrt/:matinh/edit/:id', sauromthongSRTController.editDieuTraSrtPatch);
router.patch('/dieutrasrt/:matinh/delete/:id',sauromthongSRTController.deleteDieuTraSrtPatch);


module.exports = router;
