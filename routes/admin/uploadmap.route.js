const express = require("express");
const router = express.Router();
const UploadMapController = require('../../controllers/admin/uploadmap.controller')
const multer = require('multer');
const cloudinaryRarHelper = require('../../helpers/cloudinary_rar.helper');
const upload = multer({ storage: cloudinaryRarHelper.storageRar });

// ============== MAP ========== //
router.get('/list', UploadMapController.listMap);
router.get('/create', UploadMapController.createMap);
router.post('/create', upload.single("file"), UploadMapController.createPostMap);
router.get('/edit/:id', UploadMapController.editMap);
router.patch('/edit/:id', upload.single("file"), UploadMapController.editPatchMap);
router.delete('/delete/:id', UploadMapController.deleteMap);

module.exports = router;