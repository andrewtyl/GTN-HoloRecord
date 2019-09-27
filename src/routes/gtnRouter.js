const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const gtnRouter = express.Router();
const knex = require('knex')

gtnRouter
    .post('/getEntries', jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('knexInstance')
        entrySearch = {
            db_id: req.body.db_id,
            item_id: req.body.item_id
        }

        for (const [key, value] of Object.entries(entrySearch)) {
            if (value == null) {
                return res.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if ((typeof entrySearch.db_id !== 'string') && (typeof entrySearch.db_id !== "number")) {
            return res.status(400).json({ error: 'db_id should be a number' })
        }
        if (typeof entrySearch.db_id === "string") {
            entrySearch.db_id = entrySearch.db_id.toString()
        }
        if ((typeof entrySearch.item_id !== 'string') && (typeof entrySearch.item_id !== "number")) {
            return res.status(400).json({ error: 'item_id should be a number' })
        }
        if (typeof entrySearch.item_id === "string") {
            entrySearch.item_id = entrySearch.item_id.toString()
        }

        knexInstance.from('gtn_prices').select('*').where(entrySearch)
            .then(searchRes => {
                return res.status(200).json(searchRes)
            })
            .catch(error => {
                return res.status(500).json({ error: 'Database search failed. Please try again or contact support.' })
            })

    })
    .post('/getEntry', jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('knexInstance')
        let entrySearch = { db_id: req.body.db_id, item_id: req.body.item_id, data_date: req.body.data_date }
        for (const [key, value] of Object.entries(entrySearch)) {
            if (value == null) {
                return res.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if (((typeof newEntry.db_id) !== "string") && ((typeof newEntry.db_id) !== "number")) {
            return res.status(400).json({ error: "'db_id' should be a number." })
        }

        if ((typeof newEntry.db_id) == "number") {
            newEntry.db_id = newEntry.db_id.toString()
        }

        if (((typeof newEntry.item_id) !== "string") && ((typeof newEntry.item_id) !== "number")) {
            return res.status(400).json({ error: "'item_id' should be a number." })
        }

        if ((typeof newEntry.item_id) == "number") {
            newEntry.item_id = newEntry.item_id.toString()
        }

        if (((typeof newEntry.data_date) !== "string") && ((typeof newEntry.data_date) !== "number")) {
            return res.status(400).json({ error: "'data_date' should be a string in the format of 'YYYY-MM-DD' (iso 8601)." })
        }

        if ((typeof newEntry.data_date) == "number") {
            newEntry.data_date = newEntry.data_date.toString()
        }

        knexInstance.from('gtn_prices').select('*').where(entrySearch)
            .then(searchRes => {
                if (searchRes) {
                    res.status(200).json(searchRes)
                }
                else {
                    return res.status(400).json('No entry matching search query was found.')
                }
            })
            .catch(error => {
                console.error(`ERROR AT /src/routes/gtnRouter.js GET /gtn/entry while connecting with Knex. Error details: ${error}`)
                res.status(500).json({ error: "Database search failed. Make sure date format is correct (YYYY-MM-DD), check your body syntax, then try again or contact support. Additional feedback below.", errorMessage: error })
            })
    })
    .delete('/entry', jsonBodyParser, (req, mainRes, next) => {
        const knexInstance = req.app.get('knexInstance')
        let entry_id = req.body.entry_id
        if (entry_id == null) {
            mainRes.send(400).json("Missing entry_id in the request body")
        }
        if (typeof entry_id == "number") {
            entry_id = entry_id.toString()
        }
        if (typeof entry_id !== "string") {
            mainRes.send(400).json("entry_id should be a number")
        }
        knexInstance.from('gtn_prices').select('*').where('entry_id', entry_id)
            .then(searchRes => {
                if (searchRes) {
                    knexInstance.from('gtn_prices').where('entry_id', entry_id).first().del()
                        .then(delRes => {
                            if (delRes) {
                                mainRes.send(204)
                            }
                            else {
                                console.error(`ERROR AT /src/routes/gtnRouter.js DELETE /gtn/entry while connecting with Knex during the delete request. Error details: ${error}`)
                                return mainRes.status(500).json('Database delete request failed. Please try again or contact support.')
                            }
                        })
                }
                else {
                    return patchRes.status(404).json('No entry matching entry_id was found.')
                }
            })
            .catch(error => {
                console.error(`ERROR AT /src/routes/gtnRouter.js PATCH /gtn/entry while connecting with Knex during the search request. Error details: ${error}`)
                res.status(500).json({ error: "Database search failed. Check your body syntax, then try again or contact support. Additional feedback below.", errorMessage: error })
            })
    })
    .post('/entry', jsonBodyParser, (req, postRes, next) => {
        const knexInstance = req.app.get('knexInstance')
        let newEntry = { user_id: req.body.user_id, db_id: req.body.db_id, item_id: req.body.item_id, data_date: req.body.data_date, gtn_price: req.body.gtn_price }

        for (const [key, value] of Object.entries(newEntry)) {
            if (value == null) {
                return postRes.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if (((typeof newEntry.user_id) !== "string") && ((typeof newEntry.user_id) !== "number")) {
            return postRes.status(400).json({ error: "'user_id' should be a number." })
        }

        if ((typeof newEntry.user_id) == "number") {
            newEntry.user_id = newEntry.user_id.toString()
        }

        if (((typeof newEntry.db_id) !== "string") && ((typeof newEntry.db_id) !== "number")) {
            return postRes.status(400).json({ error: "'db_id' should be a number." })
        }

        if ((typeof newEntry.db_id) == "number") {
            newEntry.db_id = newEntry.db_id.toString()
        }

        if (((typeof newEntry.item_id) !== "string") && ((typeof newEntry.item_id) !== "number")) {
            return postRes.status(400).json({ error: "'item_id' should be a number." })
        }

        if ((typeof newEntry.item_id) == "number") {
            newEntry.item_id = newEntry.item_id.toString()
        }

        if (((typeof newEntry.gtn_price) !== "string") && ((typeof newEntry.gtn_price) !== "number")) {
            return postRes.status(400).json({ error: "'gtn_price' should be a number." })
        }

        if ((typeof newEntry.gtn_price) == "number") {
            newEntry.gtn_price = newEntry.gtn_price.toString()
        }

        if (((typeof newEntry.data_date) !== "string") && ((typeof newEntry.data_date) !== "number")) {
            return postRes.status(400).json({ error: "'data_date' should be a string in the format of 'YYYY-MM-DD' (iso 8601)." })
        }

        if ((typeof newEntry.data_date) == "number") {
            newEntry.data_date = newEntry.data_date.toString()
        }

        knexInstance.from('gtn_prices').select('*').where({ db_id: newEntry.db_id, item_id: newEntry.item_id, data_date: newEntry.data_date })
            .then(searchRes => {
                console.log(searchRes)
                if (!(searchRes[0])) {
                    knexInstance.insert(newEntry).into('gtn_prices').returning('*')
                        .then(insertRes => {
                            return postRes.status(201).json(insertRes)
                        })
                        .catch(error => {
                            console.error(`ERROR AT /src/routes/gtnRouter.js POST /gtn/newEntry while connecting with Knex. Error details: ${error}`)
                            return postRes.status(500).json({ error: "Issue posting to database. Make sure date format is correct (YYYY-MM-DD), check your body syntax, then try again or contact support. Additional feedback below.", errorMessage: error })
                        })
                }
                else {
                    return postRes.status(400).json('An entry for this item and date already exists in this database.')
                }
            })
            .catch(error => {
                console.error(`ERROR AT /src/routes/gtnRouter.js POST /gtn/newEntry while connecting with Knex. Error details: ${error}`)
                postRes.status(500).json({ error: "Database search failed. Make sure date format is correct (YYYY-MM-DD), check your body syntax, then try again or contact support. Additional feedback below.", errorMessage: error })
            })



    })

module.exports = gtnRouter;