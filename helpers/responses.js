/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: responses.js
 * Last Modified: 8/19/23, 3:49 PM
 */{StatusCodes, ReasonPhrases} = require("http-status-codes");

class Responses {

    status = StatusCodes.OK
    error = false
    data = []
    message = ReasonPhrases.OK

    constructor(payload) {
        this.payload = {
            ...payload
        }
    }

    responseJson() {
        return {
            status: this.status,
            error: this.error,
            message: this.message,
            data: this.data,
            ...this.payload
        }
    }
}

module.exports = Responses