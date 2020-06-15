if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const cors = require('cors')
const connectDb = require('./models')

const indexRouter = require('./controllers')
const personsRouter = require('./controllers/api/persons')
const notesRouter = require('./controllers/api/notes')
const usersRouter = require('./controllers/api/users')
const loginRouter = require('./controllers/api/login')
const registerRouter = require('./controllers/api/register')

const app = express()

connectDb()
    .then(() => logger.info('Connected to the database.'))
    .catch(err => logger.error(err))

app.use(middleware.requestLogger) // Logs request info to the console
app.disable('x-powered-by')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

/*Morgan things*/
morgan.token('object', function (req) {
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
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)

app.use(middleware.unknownEndpoint) // Called after routes just in case none of them are called
app.use(middleware.errorHandler)

module.exports = app