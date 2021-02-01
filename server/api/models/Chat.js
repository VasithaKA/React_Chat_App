const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    conversationId: { type: String, unique: true, required: true },
    conversationName: { type: String },
    isPersonalChat: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }]
}, { timestamps: true });

module.exports = mongoose.model('chats', ChatSchema);