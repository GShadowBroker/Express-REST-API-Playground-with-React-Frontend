const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)

    switch(err.name) {
        case 'CastError':
            return res.status(400).json({error: 'Malformatted id'})
        case 'ValidationError':
            return res.status(400).json({error: err.message})
        case 'JsonWebTokenError':
            return res.status(401).json({error: "Invalid token"})
        default:
            return next(err)
    }
}

const unknownEndpoint = (req, res) => {
    res.status(404).json({error:'This endpoint does not exist or is unavailable'})
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint
}