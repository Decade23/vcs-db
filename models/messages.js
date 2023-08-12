/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: messages.js
 * Last Modified: 8/19/23, 3:49 PM
 */odel = require("./model")
const {QueryTypes} = require("sequelize");
const {separateSql, cleanFormatSelectSql} = require("../helpers/slice");
const MessageModel = require('./sequelizeModel/MessageModel')

class Messages extends Model {
    table = 'messages'
    fields = separateSql(["from", "to", "message", "message_id", "preview_url", "callback_data", "notify_url", "created_at", "created_by"])

    constructor(select) {
        super(select)
        this.select = cleanFormatSelectSql(select).length < 1 ? this.fields : cleanFormatSelectSql(select)
    }

    async getMessagesByUser(req) {
        let {limit, page} = req
        let start

        if (page == undefined || page < 1) {
            page = 1
        }

        if (limit == undefined || limit < 1) {
            limit = 10
        }

        start = (page - 1) * limit
        let query = `select ${this.select} from ${this.table} limit :start , :limit`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                start, limit
            }
        })
    }

    async countMessagesByUser() {
        let query = `select count(id) as count from ${this.table}`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT
        })
    }

    async getMessageByUserPagination(req) {
        let {page, limit} = req
        const total_data = await this.countMessagesByUser()
        const rows = await this.getMessagesByUser(req)
        let resp = {}
        resp.page = page
        resp.last_page = Math.ceil(total_data[0].count / limit)
        resp.rows = rows

        return resp
    }

    async insertMessage(req) {
        const {from, to, message, message_id, preview_url, callback_data, notify_url, created_by, handle_by_user} = req

        this.select = cleanFormatSelectSql(["from", "to", "message", "message_id", "preview_url", "callback_data", "notify_url", "created_by", "handle_by_user"])

        let query = `INSERT INTO ${this.table} (${this.select}) VALUES (:from, :to, :message, :message_id, :preview_url, :callback_data, :notify_url, :created_by, :handle_by_user)`

        return await this.conn().query(query, {
            type: QueryTypes.INSERT, replacements: {
                from, to, message, message_id, preview_url, callback_data, notify_url, created_by, handle_by_user
            }
        })
    }

    async insertMessageSeq(req) {
        const {from, to, message, message_id, preview_url, callback_data, notify_url, created_by, handle_by_user} = req
        const payload = {
            from, to, message, message_id, preview_url, callback_data, notify_url, created_by, handle_by_user
        }
        return await MessageModel.create(payload)
    }

    async getMessageConversation(req) {
        const {handle_by_user} = req
        let query = `select cu.name,
                           wam.handle_by_user,
                           wam.\`from\`,
                           wam.\`to\`,
                           wam.message_id,
                           wtm.name as type_message,
                           wam.message,
                           wam.created_at,
                           wam.created_by
                    from telesales_adira.cc_user cu
                             left join wa.messages wam
                                       on cu.id = wam.handle_by_user
                             right join wa.type_message wtm on wam.type_message = wtm.id
                    where wam.handle_by_user = :handle_by_user
                    order by wam.created_at asc`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {handle_by_user}
        })
    }

    async listsAfterCallPredictive(req) {
        const {running_at, send_to} = req
        const {count_call} = running_at
        const total_call = count_call

        let query = `select tp.customer_id,
                               count(tp.customer_id) as total_call,
                               tp.cust_name, epl.a_number, epl.last_status, epl.agent_id, epl.last_update_time
                        from ecentrix.ecentrix_prospect_log epl
                        left join telesales_adira.cc_master_category cmc on epl.last_status = cmc.id
                        left join telesales_adira.tms_prospect tp on epl.prospect_id = tp.id
                        where
                            tp.customer_id is not null
                          and
                        DATE(epl.last_update_time) >= CURDATE() - INTERVAL 30 DAY
                          and
                            epl.last_status in (1, 7)
                        group by tp.customer_id
                         HAVING total_call = :total_call
                        order by epl.last_update_time desc`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                total_call
            }
        })
    }

    async listsAfterCallPredictiveV2(req) {
        const {running_at, send_to} = req
        const {count_call} = running_at
        const total_call = count_call
        const day = 300 // take a days
        let to = ''


        if (send_to.toLowerCase() === 'uncontacted') {
            to = 'and epl.last_status != 10' // exclude last_status 10 is uncontacted
        } else {
            to = 'and epl.last_status = 10' // contacted
        }

        let query = `select epl.prospect_id,
                               count(epl.prospect_id) total_call,
                               epl.agent_id,
                               tp.cust_name,
                               CASE
                                   WHEN LEFT(epl.a_number, 1) = 0
                                       THEN (CONCAT(REPLACE(LEFT(epl.a_number, 1), 0, '62'),
                                                    RIGHT(epl.a_number, LENGTH(epl.a_number - 1))))
                                   ELSE epl.a_number END AS phone_number,
                               epl.last_update_time      as last_update_time,
                               er.description            as status_call
                        from ecentrix.ecentrix_prospect_log epl
                                 left join ecentrix.ecentrix_reference er on epl.last_status = er.code
                                 left join telesales_adira.tms_prospect tp on epl.prospect_id = tp.id
                        where er.type = 'CALL_STATUS'
                          ${to}
                          and DATE(epl.last_update_time) >= CURDATE() - INTERVAL ${day} DAY
                          and epl.a_number is not null
                          and epl.a_number != ''
                          group by epl.prospect_id
                        having total_call = :total_call
                        order by epl.last_update_time DESC, phone_number DESC`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                total_call
            }
        })
    }

    async listsAfterCallAgent(req) {
        const {running_at, send_to} = req
        const {count_call} = running_at
        const total_call = count_call
        const day = 300 // take a days

        let to = ''

        if (send_to.toLowerCase() === 'uncontacted') {
            // to = 'and epl.last_status in (1, 7)' // is uncontacted
            // is uncontacted
            to = 'tp.first_category = 1'
        } else {
            // to = 'and epl.last_status not in (1, 7)' // is contacted
            // is contacted
            to = 'tp.first_category != 1'
        }

        let query = `select tp.id                        as prospect_id,
                           count(tp.id) total_call,
                           tp.main_campaign,
                           tp.agent_id,
                           tp.cust_name,
                           CASE
                               WHEN LEFT(tp.mobile_phone, 1) = 0
                                   THEN (CONCAT(REPLACE(LEFT(tp.mobile_phone, 1), 0, '62'),
                                                RIGHT(tp.mobile_phone, LENGTH(tp.mobile_phone - 1))))
                               ELSE tp.mobile_phone END AS phone_number,
                           tp.mobile_phone              as phone_number,
                           lower(cmc.name)              as status_call,
                           tp.last_response_time        as last_update_time
                    from telesales_adira.tms_prospect tp
                             left join telesales_adira.cc_master_category cmc on tp.first_category = cmc.id
                    where 
                    ${to} 
                    group by tp.id
                    having DATE(last_update_time) >= CURDATE() - INTERVAL ${day} DAY
                    and total_call = :total_call
                    order by tp.last_response_time desc, tp.first_category asc`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                total_call
            }
        })
    }

}

module.exports = Messages
