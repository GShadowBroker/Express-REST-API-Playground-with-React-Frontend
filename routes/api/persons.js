const express = require('express')
const router = express.Router()
let Person = require('../../models/Person')

router.get('/', (req, res) => {
    Person.find({})
        .then(persons => res.status(200).json(persons))
        .catch(err => {
            console.log(err.message)
            return res.status(500).json({error:'Server request failed'})
        })
})

router.post('/', (req, res, next) => {
    let { name, number } = req.body

    if (!name) return res.status(400).json({error:'Missing name'})
    if (!number) return res.status(400).json({error:'Missing number'})

    Person.findOne({ name: name })
        .then(person => {
            console.log('person:', person)
            if (person) return res.status(400).json({error:'Name already exists'})
            
            let newPerson = new Person({
                name: name,
                number: number
            })
        
            newPerson.save()
                .then(createdPerson => {
                    return res.status(201).json(createdPerson)
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
    let id = req.params.id

    Person.findById(id)
        .then(person => {
            if (!person) return res.status(404).json({error: 'Record not found'})
            return res.status(200).json(person)
        })
        .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
    let id = req.params.id
    Person.findByIdAndDelete(id)
        .then(deletedPerson => {
            console.log('deletedPerson', deletedPerson)
            if (!deletedPerson) return res.status(404).json({error:'Record not found'})
            return res.status(204).end()
        })
        .catch(err => next(err))
})

router.put('/:id', (req, res, next) => {
    let id = req.params.id
    let { name, number } = req.body

    if (!name) return res.status(400).send({error: 'Missing name'})
    if (!number) return res.status(400).send({error: 'Missing number'})

    Person.findByIdAndUpdate(id, {
        name: name,
        number: number
    }, {new: true})
        .then(updatedPerson => {
            if (!updatedPerson) return res.status(404).json({error:'Record not found'})
            return res.status(201).json(updatedPerson)
        })
        .catch(err => next(err))
})

module.exports = router