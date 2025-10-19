const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const courseManageController = require('../controllers/courseManageController.cjs');

router.post('/fetchCurrentCourses',verifyToken, courseManageController.fetchCurrentCourses);
router.post('/fetchLecturers',verifyToken, courseManageController.fetchLecturers);
router.post('/createCourse',verifyToken, courseManageController.createCourse);
router.post('/assignLecturer',verifyToken, courseManageController.assignLecturer);
router.post('/deleteCourse',verifyToken, courseManageController.deleteCourse);
router.post('/saveCourse',verifyToken, courseManageController.saveCourse);

module.exports = router;
