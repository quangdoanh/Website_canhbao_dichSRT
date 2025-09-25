const express = require("express");
const router = express.Router();
const SHLKController = require('../../controllers/admin/sauhailakeo.controller');
const UploadController = require('../../controllers/admin/uploadmap.controller')
const DieuTraController = require('../../controllers/admin/dieutra.controller')
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// =========== DU LIEU ======== //
router.get('/dulieushlk/:matinh/list', SHLKController.listDulieuSHLK);
router.get('/dulieushlk/:matinh/create', SHLKController.createDulieuSHLK);
router.get('/dulieushlk/:matinh/edit/:id', SHLKController.editDulieuSHLK);
router.patch('/dulieushlk/:matinh/edit/:id', SHLKController.editPatchDulieuSHLK);

// =========== ĐIỀU TRA ======== //
// router.get('/dieutra/:matinh/list', DieuTraController.listDieuTra);
// router.get('/dieutra/:matinh/create', DieuTraController.createDieuTra);
// router.post('/dieutra/:matinh/create', DieuTraController.createDieuTraPost);
// router.get('/dieutra/:matinh/edit/:id', DieuTraController.editDieuTra);
// router.patch('/dieutra/:matinh/edit/:id', DieuTraController.editDieuTraPatch);
// router.patch('/dieutra/:matinh/delete/:id', DieuTraController.deleteDieuTraPatch);

// ============== MAP ========== //
// router.get('/map/:matinh/list', UploadController.listMap);
// router.get('/map/:matinh/create', UploadController.createMap);
// router.post('/map/:matinh/create', upload.single("file"), UploadController.createPostMap);
// router.get('/map/:matinh/edit/:id', UploadController.editMap);
// router.patch('/map/:matinh/edit/:id', upload.single("file"), UploadController.editPatchMap);
// router.delete('/map/:matinh/delete/:id', UploadController.deleteMap);

module.exports = router;
