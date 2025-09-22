const express = require("express");
const router = express.Router();
const degradController = require("../../controllers/admin/degrad.controller");


// Danh sách chưa xác nhận
router.get("/list/pending", degradController.listPending);

router.get("/list/confirmed", degradController.listConfirmed);

// Chi tiết bản ghi
router.get("/detail/:id", degradController.degradDetail);
router.patch("/change-status/:id", degradController.changeStatus);
router.patch('/change-multi', degradController.changeMultiPatch);
module.exports = router;