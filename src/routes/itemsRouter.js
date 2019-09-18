const { KNEX_CON } = require('../config')
const express = require('express');
const jsonBodyParser = express.json();
const itemsRouter = express.Router();
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: KNEX_CON,
})

itemsRouter
    .get('/exists', jsonBodyParser, (req, res, next) => {
        if (req.query.itemName) {
            knexInstance.from('item_list').select('*').where('item_name', req.query.itemName).first()
                .then(result => {
                    console.log(result)
                    if (result && (result.item_name === req.query.itemName)) {
                        return res.status(200).json(result)
                    }
                    else {
                        return res.status(404).json({ error: `Item does not exist` })
                    }
                })
                .catch(
                    error => {
                        return postRes.status(500).json({ error: `Database access failed. Please try again or contact support.` });
                    }
                )
        }
        else {
            return res.status(404).json({ error: `'itemName' query missing. Please resubmit with proper query.` })
        }
    })
    .post('/newItem', jsonBodyParser, (req, postRes, next) => {
        let newItem = { item_name: req.query.itemName, vendor_cost: req.query.vendorCost }

        if (newItem.item_name == null) {
            return postRes.status(400).json({ error: `Missing itemName in request body` })
        }

        if (typeof newItem.item_name !== 'string') {
            return postRes.status(400).json({ error: `'itemName' must be a string.` })
        }

        if ((newItem.vendor_cost !== null) && (typeof newItem.vendor_cost !== 'number')) {
            return postRes.status(400).json({ error: `'vendorCost must' be a number.` })
        }


        knexInstance.insert(newItem).into('item_list').returning('*')
            .then(insertRes => {
                postRes.status(201).json(insertRes)
            })
            .catch(error => {
                postRes.status(500).json({ error: "Issue posting to database. Make sure date format is correct (YYYY-MM-DD), then try again or contact support. Additional feedback below.", errorMessage: error })
            })
    })

module.exports = itemsRouter;