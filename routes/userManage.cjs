const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const userManageController = require('../controllers/userManageController.cjs');

router.post('/fetchStudentUser',verifyToken, userManageController.fetchStudentUser);
router.post('/fetchLecturerUser',verifyToken, userManageController.fetchLecturerUser);
router.post('/fetchOwnUser',verifyToken, userManageController.fetchOwnUser);
router.post('/saveUserInfo',verifyToken, userManageController.saveUserInfo);

module.exports = router;