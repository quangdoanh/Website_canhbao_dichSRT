const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/admin.controller");
const accountValidate = require('../../validates/admin/account.validates');
const multer  = require('multer');
const cloudinaryHelper = require('../../helpers/cloudinary.helper');
const upload = multer({storage: cloudinaryHelper.storage});
router.get('/list', adminController.list)
router.get('/create', adminController.adminCreate)
router.post(
    '/create',
    upload.single('avatar'),
    accountValidate.registerPost, 
    adminController.adminCreatePost
)
router.get('/edit/:id', adminController.adminEdit);
router.patch(
    '/edit/:id',
    upload.single('avatar'),
    adminController.adminEditPatch
);
router.delete('/delete/:id', adminController.adminDelete);
router.patch('/change-multi',adminController.changeMultiPatch);

module.exports = router;
