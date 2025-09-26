const router = require('express').Router();

const DichBenhController = require('../../controllers/admin/dichbenh.controller')

/*================
        SRT
==================*/

router.get('/srt/:effect/list', DichBenhController.list)
router.get('/srt/:effect/status/pending', DichBenhController.listStatusPending)
router.get('/srt/:effect/status/confirmed', DichBenhController.listStatusConfirmed)
router.patch('/srt/:effect/change-status/:id', DichBenhController.changeStatus)
router.patch('/srt/:effect/change-multi', DichBenhController.changeMultilStatus)
router.get('/srt/:effect/detail/:id', DichBenhController.Detail)



/*================
        SHk
==================*/

router.get('/shk/:effect/list', DichBenhController.listSHK)
router.get('/shk/:effect/status/pending', DichBenhController.listStatusPendingSHK)
router.get('/shk/:effect/status/confirmed', DichBenhController.listStatusConfirmedSHK)
router.patch('/shk/:effect/change-status/:id', DichBenhController.changeStatusSHK)
router.patch('/shk/:effect/change-multi', DichBenhController.changeMultilStatusSHK)
router.get('/shk/:effect/detail/:id', DichBenhController.DetailSHK)


/*================
        BHk
==================*/

router.get('/bhk/:effect/list', DichBenhController.listBHK)
router.get('/bhk/:effect/status/pending', DichBenhController.listStatusPendingBHK)
router.get('/bhk/:effect/status/confirmed', DichBenhController.listStatusConfirmedBHK)
router.patch('/bhk/:effect/change-status/:id', DichBenhController.changeStatusBHK)
router.patch('/bhk/:effect/change-multi', DichBenhController.changeMultilStatusBHK)
router.get('/bhk/:effect/detail/:id', DichBenhController.DetailBHK)

module.exports = router;