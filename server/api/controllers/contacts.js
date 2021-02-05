const Contact = require('../models/Contact');
const User = require('../models/User');

exports.add_contact = async (req, res) => {
    const { email, name } = req.body
    const { _id } = req.loggedInUserData
    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("knownAs _id")
        if (!user) return res.status(404).json({ message: "User not found" })
        const { id, knownAs } = user
        if (id === _id) return res.status(409).json({ message: "Email seems as yours." })
        const contact = { id, name }
        const updatedContact = await Contact.findOneAndUpdate({ memberId: _id, contacts: { $not: { $elemMatch: { id } } } }, { $push: { contacts: [contact] } })
        if (!updatedContact) return res.status(403).json({ message: "Alredy exist contact." })
        res.status(200).json({ id, knownAs })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.get_contacts = async (req, res) => {
    const { _id } = req.loggedInUserData
    try {
        const allContacts = await Contact.findOne({ memberId: _id }).select('contacts -_id').populate('contacts.id', 'knownAs email')
        if (!allContacts) return res.status(404).json({ message: "Contacts not found." })
        const newAllContacts = allContacts.contacts.map(contact => {
            return { id: contact.id._id, knownAs: contact.id.knownAs, name: contact.name, email: contact.id.email }
        })
        res.status(200).json(newAllContacts)
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.update_contact = async (req, res) => {
    const { id, name } = req.body
    const { _id } = req.loggedInUserData
    try {
        const updatedContact = await Contact.findOneAndUpdate({ memberId: _id, "contacts.id": id }, { $set: { "contacts.$.name": name } })
        if (!updatedContact) return res.status(404).json({ message: "Contact not found." })
        res.status(200).json({ message: "Contact was updated success." })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.remove_contact = async (req, res) => {
    const { id } = req.body
    const { _id } = req.loggedInUserData
    try {
        const deletedContact = await Contact.findOneAndUpdate({ memberId: _id, contacts: { $elemMatch: { id } } }, { $pull: { contacts: { id } } })
        if (!deletedContact) return res.status(404).json({ message: "Contact not found." })
        return res.status(200).json({ message: "Contact was deleted success." })
    } catch (error) {
        res.status(500).json({
            message: error.name
        })
    }
}