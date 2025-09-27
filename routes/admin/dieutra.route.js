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
router.get('/api/create', DieuTraController.appCreateDieuTra);
router.post('/create', DieuTraController.createDieuTraPost);

router.get('/edit/:id', DieuTraController.editDieuTra);
router.get('/api/edit/:id', DieuTraController.appEditDieuTra);

router.patch('/edit/:id', DieuTraController.editDieuTraPatch);

router.delete('/delete/:id', DieuTraController.deleteDieuTra);
router.delete('/deleteMulti', DieuTraController.deleteMultiDieuTra);

module.exports = router;