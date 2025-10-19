const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const studentManageController = require('../controllers/studentManageController.cjs');

router.post('/fetchStudentsList',verifyToken, studentManageController.fetchStudentsList);
router.post('/approveStudent',verifyToken, studentManageController.approveStudent);
router.post('/deleteStudent',verifyToken, studentManageController.deleteStudent);

module.exports = router;