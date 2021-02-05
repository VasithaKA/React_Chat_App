const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { add_contact, get_contacts, update_contact, remove_contact } = require('../controllers/contacts');

//Add contacts to list
router.put('/', checkAuth, add_contact)

//Get all contacts from list
router.get('/', checkAuth, get_contacts)

//Update contacts in list
router.patch('/', checkAuth, update_contact)

//Remove contacts from list
router.delete('/', checkAuth, remove_contact)

module.exports = router;