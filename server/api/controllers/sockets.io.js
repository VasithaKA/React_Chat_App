const Chat = require('../models/Chat');
const ChatMember = require('../models/ChatMember');
const Conversation = require('../models/Conversation');

const sendMessage = async ({ content, sentDate, conversationId, conversationName, isPersonalChat, members, socket, clientId }) => {
    const memberIds = members.map(item => item._id)
    const chatDetails = await Chat.findOne({ conversationId }).select('_id')
    if (!chatDetails && isPersonalChat) {
        var newChatDetails = await Chat.create({ conversationId, isPersonalChat, members: memberIds })
        const chatMembers = members.map(member => ({ chatId: newChatDetails._id, memberId: member._id }))
        await ChatMember.insertMany(chatMembers)
    } else if (!chatDetails && !isPersonalChat) return console.log('error in send message')
    Conversation.create({
        senderId: clientId,
        chatId: chatDetails && chatDetails._id || newChatDetails._id,
        sentDate,
        content
    }).then(() => {
        ChatMember.find({ chatId: chatDetails && chatDetails._id || newChatDetails._id, memberId: { $ne: clientId } }).updateMany({ $inc: { 'unreadCount': 1 } }).then(() => {
            memberIds.forEach(memberId => {
                socket.broadcast.to(memberId).emit('receive-message', {
                    senderId: clientId, content, sentDate, conversationId, conversationName, isPersonalChat, members, isRead: false
                })
            })
        })
    }).catch(error => {
        console.log(error)
    })
}

const createNewConversation = ({ conversationId, conversationName, members, createdDateTime, socket }) => {
    const memberIds = members.map(item => item._id)
    Chat.create({
        conversationId,
        conversationName,
        members: memberIds
    }).then(insertedData => {
        console.log("Your chat is created")
        const chatMembers = members.map(member => ({ chatId: insertedData._id, memberId: member }))
        ChatMember.insertMany(chatMembers).then(() => {
            console.log("Your chat members are added")
            memberIds.forEach(memberId => {
                socket.broadcast.to(memberId).emit('receive-conversation-details', {
                    conversationId, conversationName, members, createdDateTime
                })
            })
        })
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    sendMessage,
    createNewConversation
}