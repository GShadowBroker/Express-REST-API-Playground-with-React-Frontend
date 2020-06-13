const express = require('express')
const port = process.env.PORT || 3001
const indexRouter = require('./routes')
const personsRouter = require('./routes/api/persons')
const notesRouter = require('./routes/api/notes')
const morgan = require('morgan')
const cors = require('cors')
const connectDb = require('./models')

const app = express()

connectDb()
    .then(res => console.log('Connected to the database.'))
    .catch(err => console.log(err))

app.disable('x-powered-by')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

/*Morgan things*/
morgan.token('object', function (req, res) {
    let postRequestObject = {
        name: req.body.name,
        number: req.body.number
    }
    return JSON.stringify(postRequestObject)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

app.use('/', indexRouter)
app.use('/api/persons', personsRouter)
app.use('/api/notes', notesRouter)

const unknownEndpoint = (req, res, next) => {
    res.status(404).json({error:'This endpoint does not exist or is unavailable'})
}
app.use(unknownEndpoint) // Called after routes just in case none of them are called

const errorHandler = (err, req, res, next) => {
    console.error(err.message)
    if (err.name === 'CastError') {
        return res.status(400).json({error: 'Malformatted id'})
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({error: err.message})
    }
    next(err)
}
app.use(errorHandler)

app.listen(port, () => console.log(`Listening on port ${port}`))