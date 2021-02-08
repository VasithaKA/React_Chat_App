const Chat = require('../models/Chat');
const ChatMember = require('../models/ChatMember');
const Conversation = require('../models/Conversation');

exports.get_user_conversations = async (req, res) => {
    const { _id } = req.loggedInUserData
    try {
        const conversationIds = await ChatMember.find({ memberId: _id }).select('chatId unreadCount -_id')
        let output_collections = []
        for (let i = 0; i < conversationIds.length; i++) {
            const { chatId, unreadCount } = conversationIds[i]
            const getchatDetails = Chat.findById(chatId).select('conversationId conversationName isPersonalChat createdAt members').populate({ path: 'members', select: 'knownAs email' })
            const getmessages = Conversation.find({ chatId }).select('content senderId sentDate -_id').sort('sentDate').populate({ path: 'senderId', select: 'knownAs' })
            const response = await Promise.all([getchatDetails, getmessages])
            const messages = response[1]
            const lastUpdatedTime = messages.length > 0 ? messages[messages.length - 1].sentDate : response[0].createdAt
            output_collections.push({ ...response[0].toJSON(), lastUpdatedTime, messages, unreadCount })
        }
        res.status(200).json(output_collections)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.update_unreadCount_zero = async (req, res) => {
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
}