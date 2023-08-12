/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: menu_scheduler.js
 * Last Modified: 8/19/23, 3:49 PM
 */logger} = require("../app/logger");
const Responses = require("../helpers/responses")
const MenuSchedulerHttp = require("../http/menu_scheduler")
const {ReasonPhrases, getStatusCode} = require("http-status-codes");
const {errorHandler} = require("../helpers/slice");

class MenuTemplateMessageController {

    async get(req, res) {
        const http = new MenuSchedulerHttp();
        http.get(req.body).then((resp) => {
            logger.info('get schedulers')
            const response = new Responses()
            if (resp.hasOwnProperty('error')) {
                response.error = true
                response.message = ReasonPhrases.CONFLICT
                response.status = getStatusCode(ReasonPhrases.CONFLICT)
            }

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

    async post(req, res) {
        const http = new MenuSchedulerHttp();

        http.post(req).then((resp) => {
            logger.info('insert scheduler done!')
            const response = new Responses()
            if (resp.hasOwnProperty('error')) {
                response.error = true
                response.message = ReasonPhrases.CONFLICT
                response.status = getStatusCode(ReasonPhrases.CONFLICT)
            }
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

    async toggle(req, res) {
        const http = new MenuSchedulerHttp();
        http.toggle(req).then((resp) => {
            logger.info('toggle scheduler done!')
            const response = new Responses()
            if (resp.hasOwnProperty('error')) {
                response.error = true
                response.message = ReasonPhrases.CONFLICT
                response.status = getStatusCode(ReasonPhrases.CONFLICT)
            }
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

    async put(req, res) {
        const http = new MenuSchedulerHttp();
        http.put(req).then((resp) => {
            logger.info('update message done!')
            const response = new Responses()
            if (resp.hasOwnProperty('error')) {
                response.error = true
                response.message = ReasonPhrases.CONFLICT
                response.status = getStatusCode(ReasonPhrases.CONFLICT)
            }
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

    async delete(req, res) {
        const http = new MenuSchedulerHttp();
        http.delete(req).then((resp) => {
            logger.info('update message done!')
            const response = new Responses()
            if (resp.hasOwnProperty('error')) {
                response.error = true
                response.message = ReasonPhrases.CONFLICT
                response.status = getStatusCode(ReasonPhrases.CONFLICT)
            }
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

module.exports = MenuTemplateMessageController
