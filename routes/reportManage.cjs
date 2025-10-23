const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const reportManageController = require('../controllers/reportManageController.cjs');

router.post('/fetchSessionList',verifyToken, reportManageController.fetchSessionList);
router.post('/fetchLeaveReport',verifyToken, reportManageController.fetchLeaveReport);

module.exports = router;