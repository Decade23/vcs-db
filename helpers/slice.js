/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: slice.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const separateSql = (arr) => {
    let format = arr != undefined ? "`" + arr.join("`,`") + "`" : []
    return format
}

const cleanFormatSelectSql = (v) => {
    return separateSql(typeof v == 'string' ? v.replace(/\s/g, "").trim().split(",") : v)
}

const getIp = (req) => {
    let ips = (req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',');

    return ips[0].trim();
}

const getData = (res) => {
    // return array object
    if (res.length > 0) {
        // get object from array
        res = res[0]

        // check if object has property
        if (Object.keys(res).length > 0) {
            return res
        }

        return {}
    }
    return {}
}

function isEmptyObject(obj) {
    //if has object return false
    if (Object.keys(obj).length > 0) {
        return false
    }
    // return true object if obj an empty
    return true
}

function isHasObject(obj) {
    //if has object return true
    if (Object.keys(obj).length > 0) {
        return true
    }
    // return false object if obj an empty
    return false
}

const getToken = (req) => {
    const {authorization} = req.headers
    const auth = authorization.split(" ")

    // destructure auth
    const [authToken] = [auth[1]]

    // return token from headers
    return authToken
}

const errorHandler = (message = 'error', {
    e = {
        message: 'something went wrong', stack: ''
    }
}) => `${message === '' ? '' : message + ' : '} [${e.message}] ${JSON.stringify(e.stack)}`

module.exports = {
    separateSql, cleanFormatSelectSql, getIp, getData, getToken, isEmptyObject, isHasObject, errorHandler
}