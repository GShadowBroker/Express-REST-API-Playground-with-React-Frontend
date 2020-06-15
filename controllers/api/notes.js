const express = require('express')
const router = express.Router()
const Note = require('../../models/Note')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../../utils/getTokenFrom')

router.get('/', (req, res) => {
    Note.find({})
        .populate('user', { name: 1, username: 1 })
        .then(notes => {
            return res.status(200).json(notes)
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).json({error:'Server request failed'})
        })
})

router.post('/', async (req, res, next) => {
    let { content, important } = req.body

    // Validation ...
    if (!content) return res.status(400).send({error: 'Missing content'}) //remove when validation is added
    
    try {
        // Decode Token
        const token = getTokenFrom(req)
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

        if (!(token && decodedToken.id)) {
            return res.status(401).json({error: 'token missing or invalid'})
        }
    
        // Save
        let user = await User.findById(decodedToken.id)

        let newNote = new Note({
            content: content,
            date: new Date(),
            important: important || false,
            user: user._id
        })

        let savedNote = await newNote.save()

        user.notes = [...user.notes, savedNote._id]
        await user.save()

        return res.status(201).json(savedNote)

    } catch(err) {
        return next(err)
    }
})

router.get('/:id', (req, res, next) => {
    let id = req.params.id
    
    Note.findById(id)
        .then(note => {
            if (!note) return res.status(404).json({err:'Record not found'})
            return res.status(200).json(note)
        })
        .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
    let id = req.params.id
    Note.findByIdAndDelete(id)
        .then(deletedNote => {
            if (!deletedNote) return res.status(404).json({err:'Record not found'})
            return res.status(204).end()
        })
        .catch(err => next(err))
})

router.put('/:id', (req, res, next) => {
    let id = req.params.id
    let { content, important } = req.body

    Note.findByIdAndUpdate(
            id, 
            { content: content, important: important || false },
            { new: true }   
        )
            .then(updatedNote => {
                if (!updatedNote) return res.status(404).json({error:'Cannot find record to modify'})
                return res.status(201).json(updatedNote)
            })
            .catch(err => next(err))
})

module.exports = router