const express = require('express')
const Person = require('../models/Person')
const Note = require('../models/Note')
const router = express.Router()

router.get('/info', async (req, res) => {
    let persons = await Person.find({})
    let notes = await Note.find({})

    let newObj = {
        phonebook_records: persons.length,
        notes_records: notes.length,
        date: new Date()
    }

    res.status(200).json(newObj)
})

module.exports = router