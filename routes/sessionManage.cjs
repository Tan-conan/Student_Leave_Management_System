const express = require('express');
const router = express.Router();
const sessionManageController = require('../controllers/sessionManageController.cjs');

router.post('/createSession', sessionManageController.createSession);
router.post('/fetchCurrentSession', sessionManageController.fetchCurrentSession);
router.post('/fetchHolidays', sessionManageController.fetchHolidays);
router.post('/addHoliday', sessionManageController.addHoliday);
router.post('/editHoliday', sessionManageController.editHoliday);
router.post('/deleteHoliday', sessionManageController.deleteHoliday);

module.exports = router;
