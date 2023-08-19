/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: format.js
 * Last Modified: 8/19/23, 4:02 PM
 */
const moment = require("moment")
const date = (date) => {
    return moment(date).format("D MMMM YYYY kk:mm:ss")
}

const dateWAESB = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
}

const dateWAESBNOW = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss")
}

const unixCustom = () => {
    return moment().unix()
}
const phoneMasking = (value) => {
    let len = value.length
    let firstLength = 4
    let lastLength = 3
    // get 3 first phone number
    let first = value.substring(-len, firstLength)

    // mask middle of phone number after 3 first character and 4 last phone number
    let mask = value.substring(lastLength, len - firstLength).replace(/\d/g, "*")

    // get {lastLength} last phone number
    let last = value.substring(len - lastLength)

    return first + mask + last
}

const waFormat = (str) => {
    return `62${str.substring(1)}`
}

module.exports = {
    date, phoneMasking, dateWAESB, dateWAESBNOW, unixCustom, waFormat
}