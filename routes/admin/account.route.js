const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");
const accountValidate = require('../../validates/admin/account.validates');

router.get("/login", accountController.login);
router.post('/login',accountValidate.loginPost, accountController.loginPost);
router.post('/logout', accountController.logoutPost)

module.exports = router;
