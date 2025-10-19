const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const mainFunctionController = require('../controllers/mainFunctionController.cjs');

router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user,
  });
});

router.post('/sessionChecker',verifyToken, mainFunctionController.sessionChecker);

module.exports = router;
