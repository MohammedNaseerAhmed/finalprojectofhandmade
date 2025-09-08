const exp = require('express')
const authApp = exp.Router()
const handler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../Models/UsersModel')

// Helper to sign JWT
function signToken(user) {
    const payload = { id: user._id, role: user.role, email: user.email, name: user.fullname }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Register
authApp.post('/register', handler(async (req, res) => {
    const { fullname, email, password, role } = req.body
    if (!fullname || !email || !password || !role) {
        return res.status(400).send({ message: 'fullname, email, password, role are required' })
    }
    if (!['buyer','seller'].includes(role)) {
        return res.status(400).send({ message: 'role must be buyer or seller' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
        return res.status(409).send({ message: 'Email already registered' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    const user = await User.create({ fullname, email, password: hashed, role })
    const token = signToken(user)
    res.status(201).send({ message: 'Registered successfully', payload: { user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, createdAt: user.createdAt }, token } })
}))

// Login
authApp.post('/login', handler(async (req, res) => {
    const { email, password, role } = req.body
    if (!email || !password || !role) {
        return res.status(400).send({ message: 'email, password, role are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).send({ message: 'Invalid credentials' })
    }
    if (user.role !== role) {
        return res.status(403).send({ message: 'Role mismatch' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
        return res.status(401).send({ message: 'Invalid credentials' })
    }
    const token = signToken(user)
    res.status(200).send({ message: 'Logged in', payload: { user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, createdAt: user.createdAt }, token } })
}))

module.exports = authApp


