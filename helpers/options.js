/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: options.js
 * Last Modified: 8/19/23, 4:02 PM
 */
const syncOptModel = {
    force: false, // if true, will re-generate table every apps run/restart. note: data will be removed. take care.
    // alter: true, // if true, will re-generate table every apps run/restart and if has change on database/table.
}

module.exports = {
    syncOptModel
}