const express = require("express");
const router = express.Router();
const BHLKController = require('../../controllers/admin/benhhailakeo.controller');
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// =========== DU LIEU ======== //
router.get('/dulieubhlk/:matinh/list', BHLKController.listDulieuBHLK);
router.get('/dulieubhlk/:matinh/create', BHLKController.createDulieuBHLK);
router.get('/dulieubhlk/:matinh/edit/:id', BHLKController.editDulieuBHLK);
router.patch('/dulieubhlk/:matinh/edit/:id', BHLKController.editPatchDulieuBHLK);

// =========== ĐIỀU TRA ======== //
router.get('/dieutrabhlk/:matinh/list', BHLKController.listDieuTraBHLK);
router.get('/dieutrabhlk/:matinh/create', BHLKController.createDieuTraBHLK);
router.post('/dieutrabhlk/:matinh/create', BHLKController.createDieuTraBHLKPost);
router.get('/dieutrabhlk/:matinh/edit/:id', BHLKController.editDieuTraBHLK);
router.patch('/dieutrabhlk/:matinh/edit/:id', BHLKController.editDieuTraBHLKPatch);
router.patch('/dieutrabhlk/:matinh/delete/:id', BHLKController.deleteDieuTraBHLKPatch);

// ============== MAP ========== //
router.get('/mapbhlk/:matinh/list', BHLKController.listMapBHLK);
router.get('/mapbhlk/:matinh/create', BHLKController.createMapBHLK);
router.post('/mapbhlk/:matinh/create', upload.single("file"), BHLKController.createPostMapBHLK);
router.get('/mapbhlk/:matinh/edit/:id', BHLKController.editMapBHLK);
router.patch('/mapbhlk/:matinh/edit/:id', upload.single("file"), BHLKController.editPatchMapBHLK);
router.delete('/mapbhlk/:matinh/delete/:id', BHLKController.deleteMapBHLK);

module.exports = router;
