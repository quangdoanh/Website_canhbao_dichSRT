const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/admin/user.controller");
const accountValidate = require('../../validates/admin/account.validates');
const multer = require('multer');
const cloudinaryHelper = require('../../helpers/cloudinary.helper');
const upload = multer({ storage: cloudinaryHelper.storage });
router.get('/list', UserController.list)
router.get('/create', UserController.userCreate)
router.post(
    '/create',
    upload.single('avatar'),
    accountValidate.registerPost,
    UserController.userCreatePost
)
router.get('/edit/:id', UserController.UserEdit);
router.patch(
    '/edit/:id',
    upload.single('avatar'),
    UserController.UserEditPatch
);
router.delete('/delete/:id', UserController.UserDelete);
router.patch('/change-multi', UserController.changeMultiPatch);

router.get('/log', UserController.log)

module.exports = router;



