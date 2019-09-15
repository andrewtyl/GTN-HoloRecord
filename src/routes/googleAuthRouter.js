const express = require('express');
const jsonBodyParser = express.json();
const request = require('request');

const googleAuthRouter = express.Router();

googleAuthRouter
    .get('/validateToken', jsonBodyParser, (req, res, next) => {
        let userInfo = { token: req.query.iDtoken, email: req.query.email, googleId: req.query.googleId };

        for (const [key, value] of Object.entries(userInfo)) {
            if (value == null) {
                return res.status(400).json({ error: `Missing ${key} in request body` })
            }
        }
        if (userInfo.token.startsWith('Bearer')) {
            userInfo.token = userInfo.token.slice(7);
            const validateTokenURL = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${userInfo.token}`;
            request(validateTokenURL, function (error, resGoogle, body) {
                console.log(userInfo)
                const parsedBody = JSON.parse(body);
                console.log(parsedBody)
                if (parsedBody.error) {
                    return res.status(401).json({ error: `${parsedBody.error}` })
                }
                else if ((parsedBody.email == userInfo.email) && (parsedBody.user_id == userInfo.googleId)) {
                    return res.status(200).json(parsedBody)
                }
                else if ((parsedBody.user_id !== userInfo.googleId)) {
                    return res.status(401).json({ error: `Google ID does not match owner of token.`})
                }
                else if ((parsedBody.email !== userInfo.email)) {
                    return res.status(401).json({ error: `Email does not match owner of token.`})
                }
                else {
                    return res.status(500).json({ error: 'internal server error at GoogleAuthRouter' })
                }
            });
        }
        else {
            return res.status(404).json({ error: `Authorization must start with 'Bearer '. Example: 'Bearer 12345'`})
        }




    })

module.exports = googleAuthRouter;