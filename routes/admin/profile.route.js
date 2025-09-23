const router = require('express').Router();

const profileController = require("../../controllers/admin/profile.controller");


router.get('/edit', profileController.edit)

router.get('/api/edit', profileController.editApp)

router.patch('/edit', profileController.editPatch)  

router.get('/change-password', profileController.changePassword);
router.patch('/change-password', profileController.changePasswordPatch);


module.exports = router;
