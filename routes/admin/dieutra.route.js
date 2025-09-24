const express = require("express");
const router = express.Router();
const DieuTraController = require("../../controllers/admin/dieutra.controller")
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });
// =========== ĐIỀU TRA ======== //
router.get('/:matinh/list', DieuTraController.listDieuTra);
router.get('/:matinh/create', DieuTraController.createDieuTra);
router.post('/:matinh/create', DieuTraController.createDieuTraPost);
router.get('/:matinh/edit/:id', DieuTraController.editDieuTra);
router.patch('/:matinh/edit/:id', DieuTraController.editDieuTraPatch);
router.patch('/:matinh/delete/:id', DieuTraController.deleteDieuTraPatch);

module.exports = router;