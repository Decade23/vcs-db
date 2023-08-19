/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: menu_template_message.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {logger} = require("../app/logger");
const Responses = require("../helpers/responses")
const MenuTMHttp = require("../http/menu_template_message")
const {ReasonPhrases, getStatusCode} = require("http-status-codes");
const {errorHandler} = require("../helpers/slice");

class MenuTemplateMessageController {

    async getSC(req, res) {
        const http = new MenuTMHttp();
        http.getTMSC(req.body).then((resp) => {
            logger.info('get template messages')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('error get tm', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async get(req, res) {
        const http = new MenuTMHttp();
        http.getTM(req.body).then((resp) => {
            logger.info('get template messages')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('get tm', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async post(req, res) {
        const http = new MenuTMHttp();
        http.post(req).then((resp) => {
            logger.info('insert message done!')
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

    async scheduleList(req, res) {
        const http = new MenuTMHttp();
        http.scheduleList(req).then((resp) => {
            logger.info('get schedule list by id. done!')
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
        const http = new MenuTMHttp();
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
        const http = new MenuTMHttp();
        http.delete(req).then((resp) => {
            logger.info(`delete ${req.body?.id} template message done!`)
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
