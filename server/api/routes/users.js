const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { signup_user, signin_user, get_user_by_email } = require('../controllers/users');

//SignUp a User
router.post('/signup', signup_user)

//Sign In
router.post('/signin', signin_user)

//Find one user by email
router.get('/:email', checkAuth, get_user_by_email)

//Update Profile
// router.patch('/create/:id', checkAuth, async (req, res, next) => { })

module.exports = router;