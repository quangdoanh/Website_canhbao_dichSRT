const express = require("express");
const router = express.Router();
const DieuTraController = require("../../controllers/admin/dieutra.controller")
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });
// =========== ĐIỀU TRA ======== //
router.get('/list', DieuTraController.listDieuTra);
router.get('/api/list', DieuTraController.appListDieuTra);

router.get('/create', DieuTraController.createDieuTra);
router.post('/create', DieuTraController.createDieuTraPost);
router.get('/edit/:id', DieuTraController.editDieuTra);
router.patch('/edit/:id', DieuTraController.editDieuTraPatch);
router.patch('/delete/:id', DieuTraController.deleteDieuTraPatch);

module.exports = router;