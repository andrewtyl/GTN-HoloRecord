const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const dbRouter = express.Router();
const knex = require('knex')
const cuid = require('cuid')

const knexInstance = knex({
    client: 'pg',
    connection: KNEX_CON,
})

dbRouter
    .post('/getDBInfo', jsonBodyParser, (req, res, next) => {
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
    .post('/getAllUsersDB', jsonBodyParser, (req, res, next) => {
        if (req.body.user_id) {
            let search_user_id = req.body.user_id;
            if (typeof search_user_id == "number") {
                search_user_id = search_user_id.toString()
            }

            if (typeof search_user_id !== "string") {
                return res.status(400).json({ error: "user_id should be a number" })
            }
            else {
                knexInstance.from('db_list').select('*').where('owner_user_id', req.body.user_id)
                    .then(searchRes => { return res.status(200).json(searchRes) })
                    .catch(error => {
                        console.error(`ERROR AT /src/routes/dbRouter.js GET /users/exists while connecting with Knex. Error details: ${error}`)
                        return res.status(500).json({ error: 'Database search failed. Please try again or contact support.' })
                    })
            }
        }
        else {
            return res.status(400).json({ error: `'user_id' missing from body` })
        }
    })
    .post('/newDB', jsonBodyParser, (req, postRes, next) => {
        let gen_db_key = cuid()
        while (gen_db_key.length < 500) {
            gtn_db_key = gen_db_key + cuid()
        }
        let newDB = { owner_user_id: req.body.owner_user_id, server_name: req.body.server_name, db_key: gen_db_key }

        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return postRes.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if ((typeof newDB.owner_user_id !== 'number') && (typeof newDB.owner_user_id !== 'string')) {
            return postRes.status(400).json({ error: `'owner_user_id' should be a number.` })
        }

        if (typeof newDB.owner_user_id == 'number') {
            newDB.owner_user_id = newDB.owner_user_id.toString()
        }

        if ((typeof newDB.server_name !== 'string') || (newDB.server_name !== "Satele Shan") || (newDB.server_name !== "Star Forge") || (newDB.server_name !== "Darth Malgus") || (newDB.server_name !== "The Leviathan") || (newDB.server_name !== "Tulak Hord")) {
            return postRes.status(400).json({error: `'server_name' should be a string with a value of 'Satele Shan', 'Star Forge', 'Darth Malgus', 'The Leviathan', or 'Tulak Hord'`})
        }

        knexInstance.from('db_list').select('*').where({'owner_user_id': newDB.owner_user_id, 'server_name': newDB.server_name}).first()
            .then(result => {
                if (!result) {
                    knexInstance.insert(newDB).into('db_list').returning('*')
                        .then(insertRes => {
                            postRes.status(201).json(insertRes)
                        })
                        .catch(error => {
                            console.error(`ERROR AT /src/routes/dbRouter.js POST /db/newDB. Error details: ${error}`)
                            postRes.status(500).json({ error: "Issue posting to database. Make sure all your body values are using valid syntax, then try again or contact support. Additional feedback below.", errorMessage: error })
                        })
                }
                else {
                    res.status(400).json('User already exists.')
                }
            })
            .catch(
                error => {
                    console.error(`ERROR AT /src/routes/dbRouter.js POST /db/newDB while connecting with Knex. Error details: ${error}`)
                    return postRes.status(500).json({ error: `Database search failed. Please try again later or contact support.`, errorMessage: error });
                }
            )

    })

module.exports = dbRouter;