/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: auth.js
 * Last Modified: 8/19/23, 3:49 PM
 */logger} = require("../app/logger");
const Responses = require("../helpers/responses")
const AuthHttp = require("../http/auth")
const {ReasonPhrases, getStatusCode} = require("http-status-codes");
const {errorHandler} = require("../helpers/slice");

class AuthController {

    async get(req, res) {
        const http = new AuthHttp();
        http.get(req.body).then((resp) => {
            logger.info('get cc user done!')
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

    async login(req, res) {
        const http = new AuthHttp();
        http.login(req).then((resp) => {
            logger.info('login done!')
            const response = new Responses()

            // check if user not found
            if (Object.keys(resp).length < 1) {
                response.error = true
                response.message = "user not found."
                response.status = 401
            }

            if (resp.hasOwnProperty('error')) {
                response.error = true
                response.message = ReasonPhrases.CONFLICT
                response.status = getStatusCode(ReasonPhrases.CONFLICT)
            }

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {
            logger.error(errorHandler('error login', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async me(req, res) {
        const http = new AuthHttp();
        http.me(req).then((resp) => {
            logger.info('get current user cc done!')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('me auth', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

}

module.exports = AuthController
