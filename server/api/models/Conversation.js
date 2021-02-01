const mongoose = require('mongoose');

const ConversatoinSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chats', required: true },
    sentDate: { type: Date, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('conversatoins', ConversatoinSchema);