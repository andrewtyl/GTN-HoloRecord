const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const gtnRouter = express.Router();
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: KNEX_CON,
})

gtnRouter
    .get('/entries', jsonBodyParser, (req, res, next) => {
        entrySearch = {
            db_id: req.body.db_id,
            item_id: req.body.item_id
        }

        for (const [key, value] of Object.entries(entrySearch)) {
            if (value == null) {
                return res.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if (typeof entrySearch.db_id !== 'string') {
            return res.status(400).json({ error: 'db_id should be a string' })
        }


        if (typeof entrySearch.item_id !== 'string') {
            return res.status(400).json({ error: 'item_id should be a string' })
        }

        knexInstance.from('gtn_prices').select('*').where(entrySearch)
            .then(searchRes => {
                return res.status(200).json(searchRes)
            })
            .catch(error => {
                return res.status(500).json({ error: 'Database search failed. Please try again or contact support.' })
            })

    })
    .post('/newEntry', jsonBodyParser, (req, postRes, next) => {
        let newEntry = { user_id: req.body.user_id, db_id: req.body.db_id, item_id: req.body.item_id, data_date: req.body.data_date, gtn_price: req.body.gtn_price }

        for (const [key, value] of Object.entries(newEntry)) {
            if (value == null) {
                return postRes.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if (((typeof newEntry.user_id) !== "string") && ((typeof newEntry.user_id) !== "number")) {
            return postRes.status(400).json({ error: "'user_id' should be a string." })
        }

        if ((typeof newEntry.user_id) == "number") {
            newEntry.user_id = newEntry.user_id.toString()
        }

        if (((typeof newEntry.db_id) !== "string") && ((typeof newEntry.db_id) !== "number")) {
            return postRes.status(400).json({ error: "'db_id' should be a string." })
        }

        if ((typeof newEntry.db_id) == "number") {
            newEntry.db_id = newEntry.db_id.toString()
        }

        if (((typeof newEntry.item_id) !== "string") && ((typeof newEntry.item_id) !== "number")) {
            return postRes.status(400).json({ error: "'item_id' should be a string." })
        }

        if ((typeof newEntry.item_id) == "number") {
            newEntry.item_id = newEntry.item_id.toString()
        }

        if (((typeof newEntry.gtn_price) !== "string") && ((typeof newEntry.gtn_price) !== "number")) {
            return postRes.status(400).json({ error: "'gtn_price' should be a string." })
        }

        if ((typeof newEntry.gtn_price) == "number") {
            newEntry.gtn_price = newEntry.gtn_price.toString()
        }

        if (((typeof newEntry.data_date) !== "string") && ((typeof newEntry.data_date) !== "number")) {
            return postRes.status(400).json({ error: "'data_date' should be a string in the format of 'YYYY-MM-DD'." })
        }

        if ((typeof newEntry.data_date) == "number") {
            newEntry.data_date = newEntry.data_date.toString()
        }

        //Todo: impliment some method to check that date format is correct for input to server

        knexInstance.insert(newEntry).into('gtn_prices').returning('*')
            .then(insertRes => {
                postRes.status(201).json(insertRes)
            })
            .catch(error => {
                postRes.status(500).json({ error: "Issue posting to database. Make sure date format is correct (YYYY-MM-DD), then try again or contact support. Additional feedback below.", errorMessage: error })
            })

    })

module.exports = gtnRouter;