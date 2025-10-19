const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const LRListManageController = require('../controllers/LRListManageController.cjs');

router.post('/fetchOwnStudentLeaveRequest',verifyToken, LRListManageController.fetchOwnStudentLeaveRequest);
router.post('/fetchStudentLeaveRequest',verifyToken, LRListManageController.fetchStudentLeaveRequest);

module.exports = router;
