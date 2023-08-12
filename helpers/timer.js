/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: timer.js
 * Last Modified: 8/6/23, 2:33 PM
 */
const sleep = async (ms = 1000) => { // default 1 seconds
    await new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    sleep
}