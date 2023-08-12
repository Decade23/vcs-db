/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: seeds.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const {generateFakeUsers} = require("./users");
const {generateFakeMessages} = require("./messages");
exports.generateSeeds = async (req) => {
    var resp = {
        users: {},
        messages: {}
    }
    generateFakeUsers(req, 15)
        .then((data) => {
            resp.users.counts = data
        })
        .catch((e) => {
            resp.users.error = e.message
        })

    generateFakeMessages(req, 20)
        .then((data) => {
            resp.messages.counts = data
        })
        .catch((e) => {
            resp.messages.error = e.message
        })

    return resp
}