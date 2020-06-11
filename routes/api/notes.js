const express = require('express')
const router = express.Router()
let notes = require('../../database/notes.json')
const generateId = require('../../utils/id_generator')

router.get('/', (req, res) => res.status(200).json(notes))

router.post('/', (req, res) => {
    let { content, important } = req.body

    if (!content) return res.status(400).send({error: 'Content cannot be empty, dumbass!'})

    let newNote = {
        id: generateId(),
        content: content,
        date: new Date().toISOString(),
        important: important || false
    }

    notes = [...notes, newNote]
    return res.status(201).json(newNote)
})

router.get('/:id', (req, res) => {
    let id = Number(req.params.id)
    let note = notes.find(item => item.id === id)
    if (!note) return res.status(404).json({error: 'Cannot find that shit yo!'})
    return res.status(200).json(note)
})

router.delete('/:id', (req, res) => {
    let id = Number(req.params.id)
    let note = notes.find(item => item.id === id)

    if (!note) return res.status(404).json({error: 'Cannot delete what doesn\'t exist, you dumbass!'})
    
    notes = notes.filter(item => item.id !== id)
    return res.status(204).end()
})

router.put('/:id', (req, res) => {
    let id = Number(req.params.id)
    let note = notes.find(item => item.id === id)
    let { content, important } = req.body

    if (!note) return res.status(404).json({error: 'Cannot edit a non-existing note, you dumbass!'})
    if (!content) res.status(400).send({error: 'New content cannot be empty, dumbass!'})

    let newNote = {
        id: id,
        content: content,
        date: new Date().toISOString(),
        important: important || false
    }

    notes = [...notes.filter(item => item.id !== id), newNote]
    return res.status(201).json(newNote)
})

module.exports = router