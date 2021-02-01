const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const ChatMember = require('../models/ChatMember');
const Conversation = require('../models/Conversation');
const checkAuth = require('../middleware/check-auth');

//Get all conversations
router.get('/', checkAuth, async (req, res) => {
    const { _id } = req.loggedInUserData
    try {
        const conversationIds = await ChatMember.find({ memberId: _id }).select('chatId unreadCount -_id')
        let output_collections = []
        for (let i = 0; i < conversationIds.length; i++) {
            const { chatId, unreadCount } = conversationIds[i]
            const getchatDetails = Chat.findById(chatId).select('conversationId conversationName isPersonalChat lastUpdatedTime members').populate({ path: 'members', select: 'knownAs email' })
            const getmessages = Conversation.find({ chatId }).select('content senderId sentDate -_id').sort('sentDate').populate({ path: 'senderId', select: 'knownAs' })
            const response = await Promise.all([getchatDetails, getmessages])
            const messages = response[1]
            const lastUpdatedTime = messages[messages.length - 1].sentDate
            output_collections.push({ ...response[0].toJSON(), lastUpdatedTime, messages, unreadCount })
        }
        res.status(200).json(output_collections)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

    // let output_collections = []
    // for (let i = 0; i < conversationIds.length; i++) {
    //     const id = conversationIds[i].chatId;
    //     const chatDetails = await Chat.findById(id).select('conversationId conversationName isPersonalChat lastUpdatedTime members -_id')
    //     const messages = await Conversation.find({ chatId: id }).select('content senderId sentDate -_id')
    //     output_collections.push({ ...chatDetails.toJSON(), messages })
    // }
    // res.status(200).json(output_collections)
})

//Update 'unreadCount' to zero (0) in ChatMember
router.patch('/', checkAuth, async (req, res) => {
    const { conversationId } = req.body
    const memberId = req.loggedInUserData._id
    try {
        const conversation = await Chat.findOne({ conversationId }).select('_id')
        if (!conversation) return res.status(404).json({ message: "Cannot Found Conversation." })
        ChatMember.findOneAndUpdate({ chatId: conversation._id, memberId }, { unreadCount: 0 }).then(() => res.status(200).json({})).catch(error => res.status(500).json({ message: error.message }))
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;