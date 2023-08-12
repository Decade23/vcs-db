/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: seeds.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const {generateFakeMessageHttp} = require("../http/seeds");
const {generateFakeUsers} = require("../seeds/users");
const {logger} = require("../app/logger");
const {responseError, responseSuccess, responseJson} = require("../helpers/responses");
const {generateSeeds} = require("../seeds/seeds");
const {errorHandler} = require("../helpers/slice");


exports.generateFakerMessagesController = async (req, res) => {
    // call generate messages
    generateFakeMessageHttp(req)
        .then((d) => {
            // logger.info(`datanyaaaa::: ${d}`)
            let data = {data: d, error: false, status: 200}
            res.json(responseJson(data))
        })
        .catch((e) => {
            logger.error(errorHandler('', {e}))
            let data = {data: e.message}
            res.json(responseError(data))
        })
}

exports.generateFakerUsersController = async (req, res) => {
    // call generate messages
    generateFakeUsers(req)

    // chat messages to user wa
    let data = {}

    // return json of call service
    res.json(data)
}


exports.generateSeedsController = async (req, res) => {
    var resp = {}

    // call seeder
    generateSeeds(req)
        .then((d) => {
            logger.info(d);
            resp.data = d;
        })
        .catch((e) => {
            logger.info(e.message)
            resp.data = e.message
        })

    // return json of call service
    res.json(responseJson(resp))
}