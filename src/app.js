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

app.get('/', (req, res) => {
    res.send('This is the GTN-HoloRecord API. Please see https://github.com/andrewtyl/GTN-HoloRecord/blob/master/README.md for more information.')
})

app.use('/googleAuth', googleAuthRouter)

app.use('/users', userRouter)

app.use('/items', itemsRouter)

app.use('/db', dbRouter)

app.use('/gtn', gtnRouter)

module.exports = app