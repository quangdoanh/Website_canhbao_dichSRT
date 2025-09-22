const express = require("express");
const router = express.Router();
const SRTController = require('../../controllers/admin/sauromthong.controller');
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// =========== DU LIEU ======== //
router.get('/dulieusrt/:matinh/list', SRTController.listDulieuSRT);
router.get('/dulieusrt/:matinh/create', SRTController.createDulieuSRT);
router.get('/dulieusrt/:matinh/edit/:id', SRTController.editDulieuSRT);
router.patch('/dulieusrt/:matinh/edit/:id', SRTController.editPatchDulieuSRT);
// =========== ĐIỀU TRA ======== //
router.get('/dieutrasrt/:matinh/list', SRTController.listDieuTraSrt)
router.get('/dieutrasrt/:matinh/create', SRTController.createDieuTraSrt);
router.post('/dieutrasrt/:matinh/create', SRTController.createDieuTraSrtPost);
router.get('/dieutrasrt/:matinh/edit/:id', SRTController.editDieuTraSrt);
router.patch('/dieutrasrt/:matinh/edit/:id', SRTController.editDieuTraSrtPatch);
router.patch('/dieutrasrt/:matinh/delete/:id', SRTController.deleteDieuTraSrtPatch);

// ============== MAP ========== //
router.get('/mapsrt/:matinh/list', SRTController.listMapSrt);
router.get('/mapsrt/:matinh/create', SRTController.createMapSrt);
router.post('/mapsrt/:matinh/create', upload.single("file"), SRTController.createPostMapSrt);
router.get('/mapsrt/:matinh/edit/:id', SRTController.editMapSrt);
router.patch('/mapsrt/:matinh/edit/:id', upload.single("file"), SRTController.editPatchMapSrt);
router.delete('/mapsrt/:matinh/delete/:id', SRTController.deleteMapSrt);
module.exports = router;
