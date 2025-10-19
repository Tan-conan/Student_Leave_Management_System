const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const sessionManageController = require('../controllers/sessionManageController.cjs');

router.post('/createSession',verifyToken, sessionManageController.createSession);
router.post('/fetchCurrentSession',verifyToken, sessionManageController.fetchCurrentSession);
router.post('/fetchHolidays',verifyToken, sessionManageController.fetchHolidays);
router.post('/addHoliday',verifyToken, sessionManageController.addHoliday);
router.post('/editHoliday',verifyToken, sessionManageController.editHoliday);
router.post('/deleteHoliday',verifyToken, sessionManageController.deleteHoliday);

module.exports = router;
