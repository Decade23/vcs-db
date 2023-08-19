/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: wa.js
 * Last Modified: 8/19/23, 4:02 PM
 */
const {logger} = require("../app/logger");
const Responses = require("../helpers/responses")
const WaHttp = require("../http/wa")
const {errorHandler} = require("../helpers/slice");

class WaController {

    async get(req, res) {
        const http = new WaHttp();
        http.getWa(req.body).then((resp) => {
            logger.info('getMessage done!')
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

    async getConversation(req, res) {
        const http = new WaHttp();
        http.getWaConversation(req.body).then((resp) => {
            logger.info('getMessage done!')
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

    async sent(req, res) {
        const http = new WaHttp();
        http.sentWa(req.body).then((resp) => {
            logger.info('sentMessage done!')
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

module.exports = WaController
