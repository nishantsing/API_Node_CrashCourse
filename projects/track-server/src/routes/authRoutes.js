const express = require('express')
const mongoose = require('mongoose')

const jwt = require("jsonwebtoken")

const User = mongoose.model("User")

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = new User({ email, password })
        await user.save()

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.send({ token })
    } catch (err) {
        console.error("Signup failed", err.message);
        res.status(422).json({ success: false, error: err.message })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(422).send({ error: 'Must provide email and password' })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({ error: 'Email not found' })
        }

        await user.comparePassword(password)

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.send({ token })
    } catch (err) {
        console.error("Signup failed", err.message);
        res.status(422).json({ success: false, error: err.message })
    }
})

module.exports = router