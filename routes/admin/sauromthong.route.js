const express = require("express");
const router = express.Router();
const UploadController = require('../../controllers/admin/uploadmap.controller')
const DieuTraController = require('../../controllers/admin/dieutra.controller')
const SRTController = require('../../controllers/admin/sauromthong.controller');
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// =========== DU LIEU ======== //
router.get('/list', SRTController.listDulieuSRT);
router.get('/api/list', SRTController.appListDulieuSRT);
router.get('/detail/:id',SRTController.viewDulieuSRT)
router.get('/api/detail/:id',SRTController.appViewDulieuSRT)
router.get('/edit/:id', SRTController.editDulieuSRT);
router.patch('/edit/:id', SRTController.editPatchDulieuSRT);
// =========== ĐIỀU TRA ======== //
// router.get('/dieutra/list', DieuTraController.listDieuTra);
// router.get('/dieutra/create', DieuTraController.createDieuTra);
// router.post('/dieutra/create', DieuTraController.createDieuTraPost);
// router.get('/dieutra/edit/:id', DieuTraController.editDieuTra);
// router.patch('/dieutra/edit/:id', DieuTraController.editDieuTraPatch);
// router.patch('/dieutra/delete/:id', DieuTraController.deleteDieuTraPatch);

// ============== MAP ========== //
// router.get('/map/list', UploadController.listMap);
// router.get('/map/create', UploadController.createMap);
// router.post('/map/create', upload.single("file"), UploadController.createPostMap);
// router.get('/map/edit/:id', UploadController.editMap);
// router.patch('/map/edit/:id', upload.single("file"), UploadController.editPatchMap);
// router.delete('/map/delete/:id', UploadController.deleteMap);
module.exports = router;
