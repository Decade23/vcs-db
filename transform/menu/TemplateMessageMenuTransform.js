/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: TemplateMessageMenuTransform.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {date} = require("../../helpers/format");
const transformerPagination = (collection) => {

    collection.rows.map((v, i) => {
        collection.rows[i].created_at = date(v.created_at)
    })

    return collection
}

const transformerPaginationSeq = (collection) => {
    collection.rows.map((v, i) => {
        collection.rows[i].dataValues.sc_count = v.dataValues.schedule_list.length
    })

    return collection
}

module.exports = {
    transformerPagination, transformerPaginationSeq
}