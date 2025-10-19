const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const leaveApproveManageController = require('../controllers/leaveApproveManageController.cjs');

router.post('/fetchLeaveRequestInfo',verifyToken, leaveApproveManageController.fetchLeaveRequestInfo);
router.post('/fetchApprovementLecturers',verifyToken, leaveApproveManageController.fetchApprovementLecturers);
router.post('/checkStudentLeaveBalanceLA',verifyToken, leaveApproveManageController.checkStudentLeaveBalanceLA);
router.post('/fetchViewerDicision',verifyToken, leaveApproveManageController.fetchViewerDicision);
router.post('/approveRequest',verifyToken, leaveApproveManageController.approveRequest);
router.post('/rejectRequest',verifyToken, leaveApproveManageController.rejectRequest);

module.exports = router;