/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: auth.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const jwt = require("jsonwebtoken")
const {logger} = require("../app/logger");
const {errorHandler} = require("../helpers/slice");
exports.authCheck = (req, res, next) => {

    try {
        // destructure headers
        const {authorization} = req.headers

        // check if has headers authorization
        if (authorization === undefined) {
            return res.status(401)
        }
        const auth = authorization.split(" ")

        // destructure auth
        const [authType, authToken] = [auth[0], auth[1]]

        // check if token valid
        const verify = jwt.verify(authToken, process.env.AUTH_TOKEN)

        // check if has token from headers authorization is valid
        if (authType !== process.env.AUTH_TYPE || verify === false) {
            return res.status(401).json('unauthorized')
        }

        next()

    } catch (e) {
        logger.error(errorHandler('', {e}))
        return res.status(401).json('unauthorized')
    }

}