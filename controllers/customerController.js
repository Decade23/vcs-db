/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: customerController.js
 * Last Modified: 8/19/23, 3:49 PM
 */ger} = require("../app/logger");
const Responses = require("../helpers/responses")
const CustomerHttp = require("../http/customerHTTP")
const {errorHandler} = require("../helpers/slice");

class CustomerController {

    async getCustomerByStatusCall(req, res) {
        const http = new CustomerHttp();
        http.getCustomerByStatusCall(req.body).then((resp) => {
            logger.info('get customer by status')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('getCustomerByStatusCall', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async getCustomerByStatusCallCount(req, res) {
        const http = new CustomerHttp();
        http.getCustomerByStatusCallCount(req.body).then((resp) => {
            logger.info('get customer by status')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('getCustomerByStatusCallCount', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async getCustomers(req, res) {
        const http = new CustomerHttp();
        http.getCustomer(req.body).then((resp) => {
            logger.info('get lists of customer all status')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('getCustomers', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async getCustomersSearch(req, res) {
        const http = new CustomerHttp();
        http.getCustomerSearch(req.body).then((resp) => {
            logger.info('search customer')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('getCustomers', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }

    async getCustomersListStatusCall(req, res) {
        const http = new CustomerHttp();
        http.getCustomerlistStatusCallHttp(req.body).then((resp) => {
            logger.info('get lists status call of customer')
            const response = new Responses()

            response.data = resp
            res.json(response.responseJson())

        }).catch((e) => {

            logger.error(errorHandler('getCustomersListStatusCall', {e}))
            const response = new Responses()

            response.error = true
            response.message = "something went wrong!"

            res.json(response.responseJson())
        })
    }
}

module.exports = CustomerController
