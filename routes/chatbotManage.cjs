const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken.cjs');
const chatbotManageController = require('../controllers/chatbotManageController.cjs');

router.post('/chatbotReply',verifyToken, chatbotManageController.chatbotReply);

module.exports = router;
