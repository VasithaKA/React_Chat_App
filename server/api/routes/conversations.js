const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const ChatMember = require('../models/ChatMember');
const Conversation = require('../models/Conversation');
// const checkAuth = require('../middleware/check-auth');

//Get all conversations
router.get('/:id', async (req, res) => {
    const conversationIds = await ChatMember.find({ memberId: req.params.id }).select('chatId unreadCount -_id')
    let output_collections = []
    for (let i = 0; i < conversationIds.length; i++) {
        const id = conversationIds[i].chatId
        const unreadCount = conversationIds[i].unreadCount
        const getchatDetails = Chat.findById(id).select('conversationId conversationName isPersonalChat lastUpdatedTime members')
        const getmessages = Conversation.find({ chatId: id }).select('content senderId sentDate -_id').sort('sentDate')
        const response = await Promise.all([getchatDetails, getmessages])
        const messages = response[1]
        const lastUpdatedTime = messages[messages.length - 1].sentDate
        output_collections.push({ ...response[0].toJSON(), lastUpdatedTime, messages, unreadCount })
    }
    res.status(200).json(output_collections)
})

//Update 'unreadCount' to zero (0) in ChatMember
router.patch('/', async (req, res) => {
    const conversation = await Chat.findOne({ conversationId: req.body.conversationId }).select('_id')
    ChatMember.findOneAndUpdate({ chatId: conversation._id, memberId: req.body.memberId }, { unreadCount: 0 }).then(() => res.status(200).send()).catch(error => console.log(error))
})

module.exports = router;