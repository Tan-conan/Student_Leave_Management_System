const express = require('express');
const router = express.Router();
const mainFunctionController = require('../controllers/mainFunctionController.cjs');

router.post('/sessionChecker', mainFunctionController.sessionChecker);


module.exports = router;
