const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Contact = require('../models/Contact');

exports.signup_user = async (req, res) => {
    const { email, password, knownAs } = req.body
    if (!email || !password || !knownAs) return res.status(400).json({ message: "Please provide necessary data." })
    User.findOne({ email: email.trim().toLowerCase() }).then(existingUserName => {
        if (existingUserName) {
            return res.status(409).json({
                message: "Email already in use. Please enter another one."
            })
        }
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: err
                })
            } else {
                const user = new User({
                    email: email.trim().toLowerCase(),
                    password: hash,
                    knownAs
                })
                user.save().then(async createdUser => {
                    await Contact.create({ memberId: createdUser._id, contacts: [] })
                    const token = jwt.sign({ _id: createdUser._id, knownAs: createdUser.knownAs }, process.env.JWT_KEY)
                    res.status(201).json({
                        message: "Your account is created",
                        _id: createdUser._id,
                        email: createdUser.email,
                        knownAs: createdUser.knownAs,
                        token
                    })
                }).catch(error => {
                    res.status(500).json({
                        message: error.message
                    })
                })
            }
        })
    }).catch(error => {
        res.status(500).json({
            message: error.name
        })
    })
}

exports.signin_user = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Please provide necessary data." })
    User.findOne({ email: email.trim().toLowerCase() }).select("+password").then(foundUser => {
        if (!foundUser) {
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        bcrypt.compare(password, foundUser.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            if (result) {
                const token = jwt.sign({ _id: foundUser._id, knownAs: foundUser.knownAs }, process.env.JWT_KEY)
                return res.status(200).json({
                    message: "Login successful",
                    _id: foundUser._id,
                    email: foundUser.email,
                    knownAs: foundUser.knownAs,
                    token
                })
            }
            res.status(401).json({
                message: "Auth failed"
            })
        });
    }).catch(error => {
        res.status(500).json({
            message: error.name
        })
    })
}

exports.get_user_by_email = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.trim().toLowerCase() }).select("knownAs _id")
        if (user) {
            return res.status(200).json({ id: user._id, knownAs: user.knownAs })
        } else res.status(404).json({ message: "User not found" })
    } catch (error) {
        res.status(500).json({
            message: error.name
        })
    }
}