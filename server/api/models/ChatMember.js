const mongoose = require('mongoose');

const ChatMemberSchema = new mongoose.Schema({
    memberId: { type: String },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chats' },
    unreadCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('chat_members', ChatMemberSchema);