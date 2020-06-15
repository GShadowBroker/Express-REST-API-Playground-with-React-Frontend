const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', async (req, res, next) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username: username }) // username exists?
        const passwordCorrect = user
            ? await bcrypt.compare(password, user.passwordHash) // password is correct?
            : false

        if (!(user && passwordCorrect)) {
            return res.status(401).json({error:"Invalid username or password"})
        }
        
        const payload = {
            username: user.username,
            id: user._id
        }
        
        const token = jwt.sign(payload, process.env.TOKEN_SECRET)

        return res.status(200).send({
            token,
            username: user.username,
            name: user.name
        })

    } catch(err) {
        return next(err)
    }
})

module.exports = router