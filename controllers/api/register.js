const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../../models/User')

const router = express.Router()

router.post('/', async (req, res, next) => {
    let { username, name, password } = req.body

    // Validation ....

    try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username: username,
            name: name,
            passwordHash: passwordHash
        })
        
        const savedUser = await user.save()
        return res.status(201).json(savedUser)

    } catch(err) {
        return next(err)
    }
})

module.exports = router