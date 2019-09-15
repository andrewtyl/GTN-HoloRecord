const { DB_URL } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const dbRouter = express.Router();
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: DB_URL,
})

dbRouter
    .get('/exists', jsonBodyParser, (req, res, next) => {
        if (req.query.googleId) {
            knexInstance.from('user_list').select('*').where('user_google_id', req.query.googleId).first()
                .then(result => {
                    console.log(result)
                    if (result && (result.user_google_id === req.query.googleId)) {
                        return res.status(200).json(result)
                    }
                    else {
                        return res.status(404).json({ error: `User does not exist` })
                    }
                })
                .catch(
                    error => {
                        return postRes.status(500).json({ error: `Database insertion failed. Please check if user already exists at GET /api/users/exists or contact support.` });
                    }
                )
        }
        else {
            return res.status(404).json({ error: `'googleId' query missing. Please resubmit with proper query.` })
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
        knexInstance.insert(newUser).into('user_list').returning('*')
            .then(insertRes => {
                knexInstance.from('user_list').select('*').where('user_google_id', newUser.user_google_id).first()
                    .then(searchRes => {
                        console.log(searchRes)
                        if (searchRes && (searchRes.user_google_id == newUser.user_google_id)) {
                            postRes.status(201).json(searchRes)
                        }
                        else {
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