/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: user.js
 * Last Modified: 8/19/23, 4:02 PM
 */


const {logger} = require("../app/logger");
const Responses = require("../helpers/responses")
const UserHttp = require("../http/user")
const {errorHandler} = require("../helpers/slice");

class UserController {
    async get(req, res) {
        const userHttp = new UserHttp();
        userHttp.getHttp(req.body).then((resp) => {
            logger.info('getUsersHttp')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }
}

module.exports = UserController
