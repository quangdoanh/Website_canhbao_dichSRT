const express = require("express");
const router = express.Router();
const UploadMapController = require('../../controllers/admin/uploadmap.controller')
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// ============== MAP ========== //
router.get('/:matinh/list', UploadMapController.listMap);
router.get('/:matinh/create', UploadMapController.createMap);
router.post('/:matinh/create', upload.single("file"), UploadMapController.createPostMap);
router.get('/:matinh/edit/:id', UploadMapController.editMap);
router.patch('/:matinh/edit/:id', upload.single("file"), UploadMapController.editPatchMap);
router.delete('/:matinh/delete/:id', UploadMapController.deleteMap);

module.exports = router;