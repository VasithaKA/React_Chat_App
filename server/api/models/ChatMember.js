const mongoose = require('mongoose');

const ChatMemberSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chats', required: true },
    unreadCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('chat_members', ChatMemberSchema);