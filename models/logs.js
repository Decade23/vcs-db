/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: logs.js
 * Last Modified: 8/19/23, 3:49 PM
 */odel = require("./model")
const {QueryTypes} = require("sequelize");
const {separateSql, cleanFormatSelectSql} = require("../helpers/slice");
const LogsModel = require('./sequelizeModel/LogsModel')

class Logs extends Model {
    table = 'logs'
    fields = separateSql(["action", "data", "created_at"])

    constructor(select) {
        super(select)
        this.select = cleanFormatSelectSql(select).length < 1 ? this.fields : cleanFormatSelectSql(select)
    }

    async get(req) {
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

    async count() {
        let query = `select count(id) as count from ${this.table}`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT
        })
    }

    async getPagination(req) {
        let {page, limit} = req
        const total_data = await this.count()
        const rows = await this.get(req)
        let resp = {}
        resp.page = page
        resp.last_page = Math.ceil(total_data[0].count / limit)
        resp.rows = rows

        return resp
    }

    async insert(req) {
        const {action, data} = req
        let query = `INSERT INTO ${this.table} (\`action\`, \`data\`) VALUES (:action, :data)`

        return await this.conn().query(query, {
            type: QueryTypes.INSERT,
            replacements: {
                action, data
            }
        })
    }

    async insertSequelize(req) {
        const {action, data} = req
        const payload = {action, data}

        return await LogsModel.create(payload)
    }

}

module.exports = Logs
