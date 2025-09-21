const express = require("express");
const router = express.Router();
const aboutController = require('../../controllers/admin/about.controller');
const multer = require('multer');
const cloudinaryHelper = require('../../helpers/cloudinary.helper');
const upload = multer({ storage: cloudinaryHelper.storage });

router.get("/list", aboutController.list);
router.get("/create", aboutController.create);
router.post(
        "/create",
        upload.single('avatar'),
        aboutController.createPost
    );
router.get("/edit/:id", aboutController.aboutEdit);
router.patch(
        "/edit/:id",
        upload.single('avatar'),
        aboutController.aboutEditPatch
    );
router.patch("/change-status/:id", aboutController.changeStatus);
router.patch('/change-multi', aboutController.changeMultiPatch);
module.exports = router;
