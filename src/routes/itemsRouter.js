const express = require('express');
const jsonBodyParser = express.json();

const itemsRouter = express.Router();

itemsRouter
    .get('/', jsonBodyParser, (req, res, next) => {
        const googleId = req.query.googleId
        //check SQL_DB, user_list.user_google_id
        //does googleId exist?
        if (/* googleId does exist in database */ false) {
            return res.status(200).json({ id, name, email })
        }
        else {
            return res.status(404).json({ error: `User does not exist` })
        }
    })
    .post('/', jsonBodyParser, (req, res, next) => {
        const newUser = { user_google_id, user_email, tos_agreement, age_confirmation, user_name }
        //post to SQL_DB, user_list;
        //search for user
        if (/*user is found*/ false) {
            const returnedUser = { user_id, user_google_id, user_email, tos_agreement, age_confirmation, user_name }
            res.status(201).json(returnedUser)
        }
        else {
            res.status(500).json({ error: `Internal server error` })
        }
    })
    //.patch()
    //.delete()

module.exports = itemsRouter;