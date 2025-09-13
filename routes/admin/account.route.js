const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");


router.get("/login", accountController.login);

module.exports = router;
