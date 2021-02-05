const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { get_user_conversations, update_unreadCount_zero } = require('../controllers/conversations');

//Get all conversations
router.get('/', checkAuth, get_user_conversations)

//Update 'unreadCount' to zero (0) in ChatMember
router.patch('/', checkAuth, update_unreadCount_zero)

module.exports = router;