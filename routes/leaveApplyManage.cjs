const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const leaveApplyManageController = require('../controllers/leaveApplyManageController.cjs');

router.post('/sendRequest',verifyToken, leaveApplyManageController.sendRequest);
router.post('/checkStudentLeaveBalance',verifyToken, leaveApplyManageController.checkStudentLeaveBalance);
router.post('/dateRangeValidation',verifyToken, leaveApplyManageController.dateRangeValidation);
router.post('/findSessionRange',verifyToken, leaveApplyManageController.findSessionRange);
router.post('/fetchCurrentCourses',verifyToken, leaveApplyManageController.fetchCurrentCourses);

module.exports = router;