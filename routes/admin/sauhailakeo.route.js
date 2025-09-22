const express = require("express");
const router = express.Router();
const SHLKController = require('../../controllers/admin/sauhailakeo.controller');
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// =========== DU LIEU ======== //
router.get('/dulieushlk/:matinh/list', SHLKController.listDulieuSHLK);
router.get('/dulieushlk/:matinh/create', SHLKController.createDulieuSHLK);
router.get('/dulieushlk/:matinh/edit/:id', SHLKController.editDulieuSHLK);
router.patch('/dulieushlk/:matinh/edit/:id', SHLKController.editPatchDulieuSHLK);

// =========== ĐIỀU TRA ======== //
router.get('/dieutrashlk/:matinh/list', SHLKController.listDieuTraSHLK);
router.get('/dieutrashlk/:matinh/create', SHLKController.createDieuTraSHLK);
router.post('/dieutrashlk/:matinh/create', SHLKController.createDieuTraSHLKPost);
router.get('/dieutrashlk/:matinh/edit/:id', SHLKController.editDieuTraSHLK);
router.patch('/dieutrashlk/:matinh/edit/:id', SHLKController.editDieuTraSHLKPatch);
router.patch('/dieutrashlk/:matinh/delete/:id', SHLKController.deleteDieuTraSHLKPatch);

// ============== MAP ========== //
router.get('/mapshlk/:matinh/list', SHLKController.listMapSHLK);
router.get('/mapshlk/:matinh/create', SHLKController.createMapSHLK);
router.post('/mapshlk/:matinh/create', upload.single("file"), SHLKController.createPostMapSHLK);
router.get('/mapshlk/:matinh/edit/:id', SHLKController.editMapSHLK);
router.patch('/mapshlk/:matinh/edit/:id', upload.single("file"), SHLKController.editPatchMapSHLK);
router.delete('/mapshlk/:matinh/delete/:id', SHLKController.deleteMapSHLK);

module.exports = router;
