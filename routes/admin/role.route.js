const router = require('express').Router();

const roleController = require("../../controllers/admin/role.controller");

router.get('/list', roleController.roleList)
router.get('/create', roleController.roleCreate)
router.post('/create', roleController.roleCreatePost)
router.get('/edit/:id', roleController.roleEdit)
router.patch('/edit/:id', roleController.roleEditPatch)
router.delete('/delete/:id', roleController.roleDelete)
router.patch('/change-multi',roleController.changeMultiDelete);
module.exports = router;