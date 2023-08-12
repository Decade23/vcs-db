/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: cc_user.js
 * Last Modified: 8/19/23, 3:46 PM
 */

const Model = require("./model")
const {QueryTypes} = require("sequelize");
const {getData} = require("../helpers/slice");

class CCUserModel extends Model {
    table = 'telesales_adira.cc_user'
    fields = ["id", "site", "tenant", "name", "sales_id", "email_address", "group_id", "secret_key", "is_active", "is_default", "last_login", "login_status", "extension_id", "area_id", "head_unit_id", "spv_id", "created_by", "created_time", "updated_by", "updated_time", "group_context", "cross_sell", "limit_data", "profile_picture", "attempt_login", "ip_address", "change_password", "browser_information"]


    constructor(select) {
        super(select)
    }

    async getModel(req) {
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

    async countModel() {
        let query = `select count(id) as count from ${this.table}`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT
        })
    }

    async getModelPagination(req) {
        let {page, limit} = req
        const total_data = await this.countModel()
        const rows = await this.getModel(req)

        let resp = {}
        resp.page = page
        resp.last_page = Math.ceil(total_data[0].count / limit)
        resp.rows = rows

        return resp
    }

    async getUserByUsernameAndPassword(req) {
        const {username, password} = req
        const active = "1"
        const limit = 1

        let query = `select id, group_id, name from ${this.table} cu where cu.id = :username and cu.secret_key = :password and cu.is_active = :active limit :limit`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                username, password, active, limit
            },
        })
    }

    async me(req) {
        const {token} = req
        const active = "1"
        const limit = 1

        let query = `select cu.name, wau.token from ${this.table} cu left join wa.auth wau on wau.user_id = cu.id where wau.token = :token and cu.is_active = :active limit :limit`

        const res = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                token, active, limit
            },
        })

        return getData(res)
    }


}

module.exports = CCUserModel

