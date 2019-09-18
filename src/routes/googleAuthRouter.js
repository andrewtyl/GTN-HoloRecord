const express = require('express');
const jsonBodyParser = express.json();
const request = require('request');

const googleAuthRouter = express.Router();

googleAuthRouter
    .get('/validateToken', jsonBodyParser, (req, res, next) => {
        let userInfo = { access_token: req.body.access_token, email: req.body.email, google_id: req.body.google_id };
        for (const [key, value] of Object.entries(userInfo)) {
            if (value == null) {
                return res.status(400).json({ error: `Missing ${key} in request body` })
            }
        }
        if ((typeof userInfo.access_token) == "string") {
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
                else if ((parsedBody.user_id != userInfo.googleId)) {
                    return res.status(401).json({ error: `Google ID does not match owner of token.` })
                }
                else if ((parsedBody.email !== userInfo.email)) {
                    return res.status(401).json({ error: `Email does not match owner of token.` })
                }
                else {
                    console.error(`ERROR AT /src/routes/googleAuthRouter.js GET /googleAuth/validateToken. Error details: Line of code should be impossible to reach. Google's validate token API returned with this: ${resGoogle}; resGoogle.body: ${body}`)
                    return res.status(500).json({ error: 'Internal Server Error. Please try again or contact support.' })
                }
            });
        }
        else {
            return res.status(400).json({ error: `'access_token' should be a string.` })
        }




    })

module.exports = googleAuthRouter;