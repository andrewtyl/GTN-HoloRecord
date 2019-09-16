const { NODE_ENV, KNEX_CON } = require('./config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const knex = require('knex')
const app = express()
const googleAuthRouter = require('./routes/googleAuthRouter');
const userRouter = require('./routes/userRouter');
const itemsRouter = require('./routes/itemsRouter');
const gtnRouter = require('./routes/gtnRouter');
const dbRouter = require('./routes/dbRouter')

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

app.get('/', (req, res) => {
    res.send('This is the GTN-HoloRecord API. Please see https://github.com/andrewtyl/GTN-HoloRecord/blob/master/README.md for more information.')
})

app.get('/testDB', (req, res) => {
    const knexInstance = knex({
        client: 'pg',
        connection: KNEX_CON,
    })
    knexInstance.from('item_list').select('*')
        .then(dbRes => {
            console.log(dbRes)
            res.send(dbRes)
        })
        .catch(error => {
            console.log('DB request failed')
            console.log(error)
            res.status(500).json({error: `DB connection failed, ${error}`, errorMessage: error})
        })
})

app.use('/api/googleAuth', googleAuthRouter)

app.use('/api/users', userRouter)

app.use('/api/items', itemsRouter)

app.use('/api/db', dbRouter)

app.use('/api/gtn', gtnRouter)

module.exports = app