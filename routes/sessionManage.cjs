const express = require('express');
const router = express.Router();
const sessionManageConroller = require('../controllers/sessionManageConroller.cjs');

router.post('/createSession', sessionManageConroller.createSession);

module.exports = router;
