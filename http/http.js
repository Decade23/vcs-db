/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: http.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const axios = require("axios");
require("dotenv").config()

class Http {

    constructor() {
        this.axios = axios

    }

    channel = 'CONTACTCENTER'
    auth = `App ${process.env.INFOBIP_API_KEY}`
    config = {
        headers: {Authorization: this.auth}
    }

    fromNumber = `${process.env.ESB_FROM}`
    urlAdr = `${process.env.ESB_URL}`
    authAdr = `${process.env.ESB_API_KEY}`

    configAdr = {
        headers: {'AF-API-KEY': this.authAdr}
    }


}

module.exports = Http
