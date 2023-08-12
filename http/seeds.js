/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: seeds.js
 * Last Modified: 8/19/23, 3:49 PM
 */xios = require("axios");
const {QueryTypes} = require("sequelize")
const {db} = require("../app/databases");
const {responseSuccess, payloadJson, responseJson, responseError} = require("../helpers/responses");
const {logger} = require("../app/logger");
const {generateFakeMessages} = require("../seeds/messages");
const {StatusCodes, getStatusText} = require("http-status-codes");
const {errorHandler} = require("../helpers/slice");
require("dotenv").config()

const auth = `App ${process.env.INFOBIP_API_KEY}`

let config = {
    headers: {Authorization: auth}
}


exports.getMessagesHttp = async (req) => {
    const {limit, page} = req

    let payload = {
        limit, page
    }

    let data = {}
    const users = await db.query("select * from messages", {
        type: QueryTypes.SELECT
    })

    try {
        data = users
    } catch (e) {
        logger.error(errorHandler('', {e}))
    }

    return responseSuccess(data)
}

exports.generateFakeMessageHttp = async (req) => {
    generateFakeMessages(req)
        .then((d) => {
            return d
        })
        .catch((e) => {
            logger.error(errorHandler('', {e}))
            return 0
        })
}