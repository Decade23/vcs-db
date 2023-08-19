/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: CustomerTransform.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {date, phoneMasking} = require("../../helpers/format");
const transformerCustomerSearch = (collection) => {

    collection.map((v, i) => {
        collection[i].created_at = date(v.created_at)
        collection[i].mobile_phone_masking = `${v.customer_name} ${phoneMasking(v.mobile_phone)} [${v.status_call}]`
    })

    return collection
}

module.exports = {
    transformerCustomerSearch
}