const { NODE_ENV } = require('./config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const googleAuthRouter = require('./routes/googleAuthRouter');
const userRouter = require('./routes/userRouter');
const itemsRouter = require('./routes/itemsRouter');

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.get('/api', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/googleAuth', googleAuthRouter)

app.use('/api/users', userRouter)

app.use('/api/items', itemsRouter)

module.exports = app