const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    conversationId: { type: String, unique: true },
    conversationName: { type: String },
    isPersonalChat: { type: Boolean, default: false },
    members: [{ type: String, required: true}]
}, { timestamps: true });

module.exports = mongoose.model('chats', ChatSchema);