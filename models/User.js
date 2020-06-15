const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 5,
        required: true,
        validate: {
            validator: (v) => /[A-Z0-9_]+/i.test(v),
            message: `You can only use alphanumeric characters and underline`
        }
    },
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    passwordHash: {
        type: String,
        minlength: 6,
        required: true
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash //Don't return the password
    }
})

module.exports = mongoose.model('User', userSchema)