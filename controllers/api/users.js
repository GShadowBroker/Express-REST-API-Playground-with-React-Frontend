const express = require('express')
const User = require('../../models/User')

const router = express()

router.get('/', async (req, res, next) => {
    try {
        let users = await User
            .find({})
            .populate('notes', { content: 1, date: 1 })
        return res.status(200).json(users)
    } catch(err) {
        return next(err)
    }
})

module.exports = router