const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const userRouter = express.Router();
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: KNEX_CON,
})

userRouter
    .post('/exists', jsonBodyParser, (req, res, next) => {
        if (req.body.google_id) {
            let google_id = req.body.google_id
            if(typeof google_id == "number") {
                google_id = google_id.toString()
            }
            else if (typeof google_id == "string") {}
            else {res.status(400).json({error: "google_id should be a number"})}

            knexInstance.from('user_list').select('*').where('user_google_id', google_id).first()
                .then(result => {
                    if (result && (result.user_google_id === google_id)) {
                        return res.status(200).json(result)
                    }
                    else {
                        return res.status(404).json({ error: `User could not be found or does not exist` })
                    }
                })
                .catch(
                    error => {
                        console.error(`ERROR AT /src/routes/userRouter.js GET /users/exists while connecting with Knex. Error details: ${error}`)
                        return res.status(500).json({ error: `Database search failed. Please try again later or contact support.`, errorMessage: error });
                    }
                )
        }
        else {
            return res.status(400).json({ error: `'google_id' missing from body` })
        }
    })
    .post('/newUser', jsonBodyParser, (req, postRes, next) => {
        let newUser = { user_google_id: req.body.user_google_id, user_email: req.body.user_email, tos_agreement: req.body.tos_agreement, age_confirmation: req.body.age_confirmation, user_name: req.body.user_name }

        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return postRes.status(400).json({ error: `Missing ${key} in request body` })
            }
        }

        if ((typeof newUser.user_google_id !== 'number') && (typeof newUser.user_google_id !== 'string')) {
            return postRes.status(400).json({ error: `'user_google_id' must be a string or number.` })
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
        knexInstance.from('user_list').select('*').where('user_google_id', newUser.google_id).first()
            .then(result => {
                if (!result) {
                    knexInstance.insert(newUser).into('user_list').returning('*')
                        .then(insertRes => {
                            postRes.status(201).json(insertRes)
                        })
                        .catch(error => {
                            console.error(`ERROR AT /src/routes/userRouter.js POST /users/newUser. Error details: ${error}`)
                            postRes.status(500).json({ error: "Issue posting to database. Make sure all your body values are using valid syntax, try again or contact support. Additional feedback below.", errorMessage: error })
                        })
                }
                else {
                    res.status(400).json('User already exists.')
                }
            })
            .catch(
                error => {
                    console.error(`ERROR AT /src/routes/userRouter.js POST /users/newUser while connecting with Knex. Error details: ${error}`)
                    return postRes.status(500).json({ error: `Database search failed. Please try again later or contact support.`, errorMessage: error });
                }
            )

    })

module.exports = userRouter;