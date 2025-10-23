const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const leaveFileManageController = require('../controllers/leaveFileManageController.cjs');

router.post('/uploadLeaveFiles', verifyToken, leaveFileManageController.uploadLeaveFiles);
router.get('/getLeaveFiles/:leave_id', verifyToken, leaveFileManageController.getLeaveFiles);
router.get('/downloadLeaveFile/:file_id', verifyToken, leaveFileManageController.downloadLeaveFile);

module.exports = router;

