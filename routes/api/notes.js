const express = require('express')
const router = express.Router()
const Note = require('../../models/Note')

router.get('/', (req, res) => {
    Note.find({})
        .then(notes => {
            return res.status(200).json(notes)
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).json({error:'Server request failed'})
        })
})

router.post('/', (req, res, next) => {
    let { content, important } = req.body

    if (!content) return res.status(400).send({error: 'Missing content'})

    let newNote = new Note({
        content: content,
        date: new Date(),
        important: important || false
    })

    newNote.save()
        .then(savedNote => {
            return res.status(201).json(savedNote)
        })
        .catch(err => next(err))
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