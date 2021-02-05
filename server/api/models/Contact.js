const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    contacts: [{ id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, name: { type: String, required: true } }]
}, { timestamps: true });

module.exports = mongoose.model('contacts', ContactSchema);