/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: authentication.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const openssldecrypt = (plainPassword) => {
    const chiper = "AES-256-ECB";
    const hashKey = crypto.createHash("sha256")
    const chiperRaw = new Buffer(plainPassword, "base64")
    return ''
}

const getAuthUser = (req) => {
    // destructure headers
    const {authorization} = req.headers
    // check if has headers authorization
    if (authorization === undefined) {
        return res.status(401)
    }
    const auth = authorization.split(" ")

    // destructure auth
    const [authToken] = [auth[1]]

    // if completed next request
    const decoded = jwt.decode(authToken)
    // assign user login to body
    return decoded
}


module.exports = {
    openssldecrypt, getAuthUser
}