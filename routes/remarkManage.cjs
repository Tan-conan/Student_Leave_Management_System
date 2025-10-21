const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const remarkManageController = require('../controllers/remarkManageController.cjs');

router.post('/sendRemark',verifyToken, remarkManageController.sendRemark);
router.post('/fetchRemark',verifyToken, remarkManageController.fetchRemark);

module.exports = router;