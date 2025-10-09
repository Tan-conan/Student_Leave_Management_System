const express = require('express');
const router = express.Router();
const courseManageController = require('../controllers/courseManageController.cjs');

router.post('/fetchCurrentCourses', courseManageController.fetchCurrentCourses);
router.post('/fetchLecturers', courseManageController.fetchLecturers);
router.post('/createCourse', courseManageController.createCourse);
router.post('/assignLecturer', courseManageController.assignLecturer);
router.post('/deleteCourse', courseManageController.deleteCourse);

module.exports = router;
