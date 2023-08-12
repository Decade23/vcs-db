/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: CustomerTransform.js
 * Last Modified: 8/6/23, 2:33 PM
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