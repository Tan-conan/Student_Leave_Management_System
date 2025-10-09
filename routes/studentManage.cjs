const express = require('express');
const router = express.Router();
const studentManageController = require('../controllers/studentManageController.cjs');

router.post('/fetchStudentsList', studentManageController.fetchStudentsList);
router.post('/approveStudent', studentManageController.approveStudent);
router.post('/deleteStudent', studentManageController.deleteStudent);

module.exports = router;