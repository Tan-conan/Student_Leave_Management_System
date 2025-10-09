const express = require('express');
const router = express.Router();
const lecturerManageController = require('../controllers/lecturerManageController.cjs');

router.post('/fetchLecturersList', lecturerManageController.fetchLecturersList);
router.post('/approveLecturer', lecturerManageController.approveLecturer);
router.post('/deleteLecturer', lecturerManageController.deleteLecturer);

module.exports = router;