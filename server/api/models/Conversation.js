const mongoose = require('mongoose');

const ConversatoinSchema = new mongoose.Schema({
    senderId: { type: String },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chats' },
    sentDate: { type: Date, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('conversatoins', ConversatoinSchema);