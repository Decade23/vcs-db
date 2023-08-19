/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: auth.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const Model = require("./model")
const {QueryTypes} = require("sequelize");
const {cleanFormatSelectSql} = require("../helpers/slice");
const AuthSeqModel = require('./sequelizeModel/AuthModel')

class AuthModel extends Model {
    table = 'auth'
    fields = ["id", "user_id", "device", "ip", "token", "login_at", "expired_at"]


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

    async insert(req) {
        const {user_id, device, ip, token} = req
        this.select = cleanFormatSelectSql(["user_id", "device", "ip", "token"])
        let query = `insert into ${this.table} (${this.select}) values (:user_id, :device, :ip, :token)`

        return await this.conn().query(query, {
            type: QueryTypes.INSERT,
            replacements: {
                user_id, device, ip, token
            },
        })
    }

    async insertSequelize(req) {
        const {user_id, device, ip, token} = req
        const payload = {user_id, device, ip, token}

        return await AuthSeqModel.create(payload)

    }

    async update(req) {
        const {user_id, device, ip, token} = req
        this.select = cleanFormatSelectSql(["user_id", "device", "ip", "token"])
        let query = `update  ${this.table} set user_id = :user_id, device = :device, ip = :ip, token = :token, expired_at = (current_timestamp() + interval 7 day) where user_id = :user_id`

        return await this.conn().query(query, {
            type: QueryTypes.UPDATE,
            replacements: {
                user_id, device, ip, token
            },
        })
    }

    async hasAuth(req) {
        const {user_id} = req
        this.select = cleanFormatSelectSql(["user_id"])
        let query = `select ${this.select} count from ${this.table} where user_id = :user_id limit 1`

        let res = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                user_id
            },
        })

        // return array object
        if (res.length > 0) {
            // get object from array
            res = res[0]

            // check if object has property
            if (Object.keys(res).length > 0) {
                return true
            }

            return false
        }

        return false
    }

    async checkStatusAuth(req) {
        const {user_id} = req
        const status = "ACTIVE"
        this.select = cleanFormatSelectSql(["user_id"])
        let query = `select ${this.select} count from ${this.table} where user_id = :user_id and status = :status limit 1`

        let res = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                user_id, status
            },
        })

        // return array object
        if (res.length > 0) {
            // get object from array
            res = res[0]

            // check if object has property
            if (Object.keys(res).length > 0) {
                return true
            }

            return false
        }

        return false
    }


}

module.exports = AuthModel

