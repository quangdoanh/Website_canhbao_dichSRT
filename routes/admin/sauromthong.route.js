const express = require("express");
const router = express.Router();
const sauromthongSRTController = require('../../controllers/admin/sauromthong.controller');

// =========== DU LIEU ======== //
router.get('/dulieusrt/:matinh/list', sauromthongSRTController.listDulieuSRT);
router.get('/dulieusrt/:matinh/create', sauromthongSRTController.createDulieuSRT);
router.get('/dulieusrt/:matinh/edit/:id', sauromthongSRTController.editDulieuSRT);
router.patch('/dulieusrt/:matinh/edit/:id', sauromthongSRTController.editPatchDulieuSRT);
// =========== ĐIỀU TRA ======== //
router.get('/dieutrasrt/:matinh/list', sauromthongSRTController.listDieuTraSrt)
router.get('/api/dieutrasrt/:matinh/list', sauromthongSRTController.appListDieuTraSrt);

router.get('/dieutrasrt/:matinh/create', sauromthongSRTController.createDieuTraSrt);
router.post('/dieutrasrt/:matinh/create', sauromthongSRTController.createDieuTraSrtPost);
router.get('/dieutrasrt/:matinh/edit/:id', sauromthongSRTController.editDieuTraSrt);
router.patch('/dieutrasrt/:matinh/edit/:id', sauromthongSRTController.editDieuTraSrtPatch);
router.patch('/dieutrasrt/:matinh/delete/:id', sauromthongSRTController.deleteDieuTraSrtPatch);


module.exports = router;
