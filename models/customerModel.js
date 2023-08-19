/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: customerModel.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const Model = require("./model")
const {QueryTypes} = require("sequelize");
const {separateSql, cleanFormatSelectSql, getData} = require("../helpers/slice");

class CustomerModel extends Model {
    table = ''
    fields = separateSql([])

    constructor(select) {
        super(select)
        this.select = cleanFormatSelectSql(select).length < 1 ? this.fields : cleanFormatSelectSql(select)
    }

    async getCustomerByStatus(req) {
        let {limit, page} = req
        let start

        if (page === undefined || page < 1) {
            page = 1
        }

        if (limit === undefined || limit < 1) {
            limit = 10
        }

        start = (page - 1) * limit
        let query = `select tp.customer_id,
                               CASE
                                   WHEN (tp.cust_name IS NULL OR TP.cust_name = '')
                                       THEN 'NO_NAME'
                                   ELSE tp.cust_name END       customer_name,
                               CASE
                                   WHEN LEFT(tp.mobile_phone, 1) = 0
                                       THEN (REPLACE(tp.mobile_phone, LEFT(tp.mobile_phone, 1), '62'))
                                   ELSE tp.mobile_phone END AS mobile_phone,
                               cmc.name                        status_call,
                               tp.created_time
                        from telesales_adira.tms_prospect tp
                                 left join telesales_adira.cc_master_category cmc on tp.first_category = cmc.id
                        HAVING status_call is not null
                        ORDER BY tp.created_time DESC limit :start , :limit`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                start, limit
            }
        })
    }

    async getCustomer(req) {
        const {status_call} = req

        let query = `select tp.customer_id,
                               CASE
                                   WHEN (tp.cust_name IS NULL OR TP.cust_name = '')
                                       THEN 'NO_NAME'
                                   ELSE tp.cust_name END       customer_name,
                                   
                               CASE
                                   WHEN LEFT(tp.mobile_phone, 1) = 0
                                       THEN (CONCAT(REPLACE(LEFT(tp.mobile_phone, 1), 0, '62'),
                                                    RIGHT(tp.mobile_phone, LENGTH(tp.mobile_phone - 1))))
                                   ELSE tp.mobile_phone END AS mobile_phone,
                               cmc.name                        status_call,
                               tp.created_time
                        from telesales_adira.tms_prospect tp
                                 left join telesales_adira.cc_master_category cmc on tp.first_category = cmc.id
                        HAVING status_call is not null
                        AND UPPER(status_call) = UPPER(:status_call)
                        ORDER BY tp.created_time DESC `

        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                status_call
            }
        })
    }

    async getCustomerSearch(req) {
        const {customer_name} = req

        let query = `select tp.customer_id,
                               CASE
                                   WHEN (tp.cust_name IS NULL OR TP.cust_name = '')
                                       THEN 'NO_NAME'
                                   ELSE tp.cust_name END       customer_name,
                                   
                               CASE
                                   WHEN LEFT(tp.mobile_phone, 1) = 0
                                       THEN (CONCAT(REPLACE(LEFT(tp.mobile_phone, 1), 0, '62'),
                                                    RIGHT(tp.mobile_phone, LENGTH(tp.mobile_phone - 1))))
                                   ELSE tp.mobile_phone END AS mobile_phone,
                               cmc.name                        status_call,
                               tp.created_time
                        from telesales_adira.tms_prospect tp
                                 left join telesales_adira.cc_master_category cmc on tp.first_category = cmc.id
                        GROUP BY mobile_phone
                        HAVING status_call is not null
                           AND LOWER(customer_name) LIKE LOWER(:customer_name)
                        ORDER BY tp.created_time DESC LIMIT 10`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                customer_name: `%${customer_name}%`
            }
        })
    }

    async getListsStatusCall() {
        let query = `select cmc.id, cmc.name
                        from telesales_adira.tms_prospect tp
                                 left join telesales_adira.cc_master_category cmc on tp.first_category = cmc.id
                        GROUP BY name
                        having name IS NOT NULL`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT
        })
    }

    async countCustomerByStatus() {
        let query = `select count(tp.customer_id) c
                        from telesales_adira.tms_prospect tp
                                 left join telesales_adira.cc_master_category cmc on tp.first_category = cmc.id
                        WHERE cmc.name is not null
                        ORDER BY tp.created_time DESC`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT
        })
    }

    async getCustomerByStatusPagination(req) {
        let {page, limit} = req
        const total_data = await this.countCustomerByStatus()
        const rows = await this.getCustomerByStatus(req)
        let resp = {}
        resp.page = page
        resp.last_page = Math.ceil(total_data[0].c / limit)
        resp.rows = rows

        return resp
    }
}

module.exports = CustomerModel
