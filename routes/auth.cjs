const express = require('express');
const router = express.Router();
const pool = require('../config/database.cjs');
const authController = require('../controllers/authController.cjs');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/programs', authController.programList);

module.exports = router;
