/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: user.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const Http = require("./http")
const Users = require("../models/users")

class UserHttp extends Http {

    constructor() {
        super();
    }

    async getHttp(req) {
        const userModel = new Users(["id", "name", "phone_number", "type", "created_at", "created_by"])
        return await userModel.getModelPagination(req)
    }
}

module.exports = UserHttp
