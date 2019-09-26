const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const itemsRouter = express.Router();
const knex = require('knex')

itemsRouter
    .post('/exists', jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('knexInstance')
        if (req.body.item_name) {
            if (typeof google_id !== "string") { res.status(400).json({ error: "item_name should be a string" }) }

            knexInstance.from('item_list').select('*').where('item_name', req.body.item_name).first()
                .then(result => {
                    if (result && (result.item_name === req.query.item_name)) {
                        return res.status(200).json(result)
                    }
                    else {
                        return res.status(404).json({ error: `Item could not be found or does not exist` })
                    }
                })
                .catch(
                    error => {
                        console.error(`ERROR AT /src/routes/itemRouter.js GET /items/exists while connecting with Knex. Error details: ${error}`)
                        return res.status(500).json({ error: `Database search failed. Please try again later or contact support.`, errorMessage: error });
                    }
                )
        }
        else {
            return res.status(404).json({ error: `'itemName' missing from body` })
        }
    })
    .post('/entry', jsonBodyParser, (req, postRes, next) => {
        const knexInstance = req.app.get('knexInstance')
        let newItem = { item_name: req.body.item_name, vendor_cost: req.body.vendor_cost }

        if (newItem.item_name == null) {
            return postRes.status(400).json({ error: `Missing item_name in body` })
        }

        if (typeof newItem.item_name !== 'string') {
            return postRes.status(400).json({ error: `'item_name' must be a string.` })
        }

        if ((newItem.vendor_cost !== null) && (typeof newItem.vendor_cost !== 'number')) {
            return postRes.status(400).json({ error: `'vendor_cost' must be a number.` })
        }


        knexInstance.from('item_list').select('*').where('item_name', newItem.item_name).first()
            .then(result => {
                if (!result) {
                    knexInstance.insert(newItem).into('item_list').returning('*')
                        .then(insertRes => {
                            postRes.status(201).json(insertRes)
                        })
                        .catch(error => {
                            console.error(`ERROR AT /src/routes/itemRouter.js POST /items/newItem. Error details: ${error}`)
                            postRes.status(500).json({ error: "Issue posting to database. Make sure all your body values are using valid syntax, then try again or contact support. Additional feedback below.", errorMessage: error })
                        })
                }
                else {
                    res.status(400).json('Item already exists.')
                }
            })
            .catch(
                error => {
                    console.error(`ERROR AT /src/routes/itemRouter.js POST /items/newItem while connecting with Knex. Error details: ${error}`)
                    return postRes.status(500).json({ error: `Database search failed. Please try again later or contact support.`, errorMessage: error });
                }
            )
    })

module.exports = itemsRouter;