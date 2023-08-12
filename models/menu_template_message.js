/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: menu_template_message.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const Model = require("./model")
const {QueryTypes, Op} = require("sequelize");
const TemplateMessageModel = require('./sequelizeModel/TemplateMessageModel')
const {separateSql, cleanFormatSelectSql, getData} = require("../helpers/slice");
const ScheduleModel = require('./sequelizeModel/ScheduleModel')

class MenuTemplateMessageModel extends Model {
    table = 'template_message'
    fields = separateSql(["id", "title", "message", "created_at"])

    constructor(select) {
        super(select)
        this.select = cleanFormatSelectSql(select).length < 1 ? this.fields : cleanFormatSelectSql(select)
    }

    async getTMSequelize(request) {
        let {page, limit} = request
        let resp = {
            rows: [], page, last_page: 0
        }

        let offset

        if (page === undefined || page < 1) {
            page = 1
        }

        if (limit === undefined || limit < 1) {
            limit = 10
        }
        offset = (page - 1) * limit

        resp.page = page
        resp.last_page = Math.ceil(await TemplateMessageModel.count() / limit)
        resp.rows = await TemplateMessageModel.findAll({
            // subQuery: false,
            attributes: ['id', 'title', 'message', 'created_at', // [sequelize.fn('COUNT', sequelize.col('schedule_list.title')), 'sc_count']
            ], include: 'schedule_list', // group: ['TemplateMessageModel.title'],
            limit, offset
        })

        return resp
    }

    async getMenuByUser(req) {
        let {limit, page} = req
        let start

        if (page === undefined || page < 1) {
            page = 1
        }

        if (limit === undefined || limit < 1) {
            limit = 10
        }

        start = (page - 1) * limit
        let query = `select tm.id, tm.title, tm.message, tm.created_at, count(sc.title) sc_count from
                        ${this.table} tm left join scheduler sc on tm.id = sc.type_message
                        group by tm.id
                        order by tm.created_at DESC
                        limit :start , :limit`

        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                start, limit
            }
        })
    }

    async getMenuTMForScheduler(req) {
        let {limit, page} = req
        let start

        if (page === undefined || page < 1) {
            page = 1
        }

        if (limit === undefined || limit < 1) {
            limit = 1000
        }

        start = (page - 1) * limit
        this.select = ["id", "title AS name"]

        let query = `select ${this.select} from ${this.table}
                        order by created_at DESC 
                        limit :start , :limit`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                start, limit
            }
        })
    }

    async countMenuByUser() {
        let query = `select count(id) as count from ${this.table}`
        return await this.conn().query(query, {
            type: QueryTypes.SELECT
        })
    }

    async getByTitle(req) {
        const {title} = req
        let query = `select ${this.select} from ${this.table} where title = :title limit 1`
        const resp = await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                title
            }
        })

        return getData(resp)
    }

    async getById(req) {
        const {id} = req
        let query = `select ${this.select} from ${this.table} where id = :id limit 1`
        const resp = await this.conn().query(query, {
            type: QueryTypes.SELECT, replacements: {
                id
            }
        })

        return getData(resp)
    }

    async getByUserPagination(req) {
        let {page, limit} = req

        const total_data = await this.countMenuByUser()
        const rows = await this.getMenuByUser(req)

        let resp = {}
        resp.page = page
        resp.last_page = Math.ceil(total_data[0].count / limit)
        resp.rows = rows

        return resp
    }


    async insertMessage(req) {
        const {title, message, created_by} = req

        this.select = cleanFormatSelectSql(["title", "message", "created_at", "created_by"])
        let query = `INSERT INTO ${this.table} (${this.select}) VALUES (:title, :message, now(), :created_by)`
        const qExe = await this.conn().query(query, {
            type: QueryTypes.INSERT, replacements: {
                title, message, created_by
            }
        })

        return qExe
    }

    async updateMessage(req) {
        const {id, title, message, created_by} = req

        this.select = cleanFormatSelectSql(["title", "message", "created_by"])
        let query = `update  ${this.table} set title = :title, message = :message, created_at = now(), created_by = :created_by where id = :id`

        return await this.conn().query(query, {
            type: QueryTypes.UPDATE, replacements: {
                title, message, created_by, id
            },
        })
    }

    async deleteMessage(req) {
        const {id} = req

        let query = `delete from ${this.table} where id = :id`

        return await this.conn().query(query, {
            type: QueryTypes.DELETE, replacements: {
                id
            },
        })
    }
}

module.exports = MenuTemplateMessageModel
