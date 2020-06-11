const express = require('express')
const persons = require('../database/persons.json')
const notes = require('../database/notes.json')
const router = express.Router()

router.get('/info', (req, res) => {
    let newObj = {
        phonebook_records: persons.length,
        notes_records: notes.length,
        viewed: new Date().toISOString
    }
    res.status(200).json(newObj)
})

module.exports = router