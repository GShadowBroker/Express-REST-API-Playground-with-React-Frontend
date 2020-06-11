const express = require('express')
const router = express.Router()
let persons = require('../../database/persons.json')
const generateId = require('../../utils/id_generator')

router.get('/', (req, res) => res.status(200).json(persons))

router.post('/', (req, res) => {
    let { name, number } = req.body

    if (!name) return res.status(400).json({error:'Missing name'})
    if (!number) return res.status(400).json({error:'Missing number'})

    if (persons.find(i => i.name === name)) {
        return res.status(400).json({error:'Name must be unique'})
    }

    let newPerson = {
        id: generateId(persons),
        name: name,
        number: number
    }

    persons = [...persons, newPerson]
    return res.status(201).json(newPerson)
})

router.get('/:id', (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find(item => item.id === id)

    if (!person) return res.status(404).json({error: 'Record not found'})

    return res.status(200).json(person)
})

router.delete('/:id', (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find(item => item.id === id)

    if (!person) return res.status(404).json({error: 'Record not found'})
    
    persons = persons.filter(item => item.id !== id)

    return res.status(204).end()
})

router.put('/:id', (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find(item => item.id === id)
    let { name, number } = req.body

    if (!person) return res.status(404).json({error: 'Person not found'})
    if (!name) res.status(400).send({error: 'Name must not be empty'})
    if (!number) res.status(400).send({error: 'Number must not be empty'})

    let newPerson = {
        id: id,
        name: name,
        number: number
    }

    persons = [...persons.filter(item => item.id !== id), newPerson]
    return res.status(201).json(newPerson)
})

module.exports = router