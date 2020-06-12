if (process.env.NODE_ENV !== 'production') require('dotenv').config('../.env')
const mongoose = require('mongoose')

/* CONNECT TO DATABASE */
const connectDb = () => {
    return mongoose
        .connect(process.env.DB_CONNECTION_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
}

module.exports = connectDb