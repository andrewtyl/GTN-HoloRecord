const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const dbRouter = express.Router();
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: KNEX_CON,
})

dbRouter
    .get('/dbInfo', jsonBodyParser, (req, res, next) => {
        if (req.body.db_id) {
            let search_db_id = req.body.db_id
            if (typeof search_db_id == "number") {
                search_db_id = search_db_id.toString()
            }

            if (typeof search_db_id !== "string") {
                return res.status(400).json({ error: "db_id should be a number" })
            }
            else {
                knexInstance.from('db_list').select('*').where('db_id', search_db_id).first()
                    .then(result => {
                        if (result && (result.db_id == search_db_id)) {
                            return res.status(200).json(result)
                        }
                        else {
                            return res.status(404).json({ error: `This database does not exist` })
                        }
                    })
                    .catch(
                        error => {
                            console.error(`ERROR AT /src/routes/dbRouter.js GET /db/dbInfo while connecting with Knex. Error details: ${error}`)
                            return res.status(500).json({ error: `Database search failed. Please try again or contact support.` });
                        }
                    )
            }
        }
        else {
            return res.status(404).json({ error: `'db_Id' missing from body` })
        }
    })
    .get('/allUsersDB', jsonBodyParser, (req, res, next) => {
        if (req.body.user_id) {
            knexInstance.from('db_list').select('*').where('owner_user_id', req.body.user_id)
                .then(searchRes => { return res.status(200).json(searchRes) })
                .catch(error => {
                    console.error(`ERROR AT /src/routes/dbRouter.js GET /users/exists while connecting with Knex. Error details: ${error}`)
                    return res.status(500).json({ error: 'Database search failed. Please try again or contact support.' })
                })
        }
        else {
            return res.status(400).json({ error: `'user_id' missing from body` })
        }
    })
    .post('/newDB', jsonBodyParser, (req, postRes, next) => {
        let newUser = { user_google_id: req.body.user_google_id, user_email: req.body.user_email, tos_agreement: req.body.tos_agreement, age_confirmation: req.body.age_confirmation, user_name: req.body.user_name }

        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return postRes.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if ((typeof newUser.user_google_id !== 'number') && (typeof newUser.user_google_id !== 'string')) {
            return postRes.status(400).json({ error: `'user_google_id' must be a string.` })
        }

        if (typeof newUser.user_google_id == 'number') {
            newUser.user_google_id = newUser.user_google_id.toString()
        }

        if ((typeof newUser.user_email !== 'string')) {
            return postRes.status(400).json({ error: `'user_email' must be a string.` })
        }

        if ((typeof newUser.user_name !== 'string')) {
            return postRes.status(400).json({ error: `'user_name' must be a string.` })
        }

        if ((typeof newUser.tos_agreement !== 'boolean')) {
            return postRes.status(400).json({ error: `'tos_agreement' must be a boolean.` })
        }

        if ((typeof newUser.age_confirmation !== 'boolean')) {
            return postRes.status(400).json({ error: `'age_confirmation' must be a boolean.` })
        }
        knexInstance.insert(newUser).into('user_list').returning('*')
            .then(insertRes => {
                knexInstance.from('user_list').select('*').where('user_google_id', newUser.user_google_id).first()
                    .then(searchRes => {
                        console.log(searchRes)
                        if (searchRes && (searchRes.user_google_id == newUser.user_google_id)) {
                            postRes.status(201).json(searchRes)
                        }
                        else {
                            console.error(`ERROR AT /src/routes/dbRouter.js GET /db/newDB while connecting with Knex. Error details: ${error}`)
                            postRes.status(500).json({ error: `User may have not been successfully posted to database. Try GET /api/users/exists or contact support.` })
                        }
                    })
            })
            .catch(
                error => {
                    return postRes.status(500).json({ error: `Database insertion failed. Please check if user already exists at GET /api/users/exists or contact support.` });
                }
            )

    })

module.exports = dbRouter;