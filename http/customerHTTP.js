/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: customerHTTP.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const Http = require("./http")
const CustomerModel = require("../models/customerModel")
const {transformerCustomerSearch} = require("../transform/menu/CustomerTransform");

class CustomerHttp extends Http {

    constructor() {
        super();
    }

    async getCustomerByStatusCall(req) {
        const mdl = new CustomerModel()
        return await mdl.getCustomerByStatusPagination(req)
    }

    async getCustomerByStatusCallCount() {
        const mdl = new CustomerModel()
        return await mdl.countCustomerByStatus()
    }

    async getCustomer(req) {
        const mdl = new CustomerModel()
        return await mdl.getCustomer(req)
    }

    async getCustomerSearch(req) {
        const mdl = new CustomerModel()
        return transformerCustomerSearch(await mdl.getCustomerSearch(req))
    }

    async getCustomerlistStatusCallHttp() {
        const mdl = new CustomerModel()
        return await mdl.getListsStatusCall()
    }

}

module.exports = CustomerHttp
