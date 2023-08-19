/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: users.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const Model = require("./model")
const {QueryTypes} = require("sequelize");

class UsersModel extends Model {
    table = 'users'
    fields = ["id", "name", "phone_number", "type", "created_at", "modify_at", "created_by"]


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


}

module.exports = UsersModel

