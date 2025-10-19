const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const lecturerManageController = require('../controllers/lecturerManageController.cjs');

router.post('/fetchLecturersList',verifyToken, lecturerManageController.fetchLecturersList);
router.post('/approveLecturer',verifyToken, lecturerManageController.approveLecturer);
router.post('/deleteLecturer',verifyToken, lecturerManageController.deleteLecturer);

module.exports = router;