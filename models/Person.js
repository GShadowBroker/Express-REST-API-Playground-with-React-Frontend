const mongoose = require('mongoose')

let noteSchema = new mongoose.Schema({
    name: String,
    number: String
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', noteSchema)