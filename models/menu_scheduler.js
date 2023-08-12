/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: menu_scheduler.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const Model = require("./model")
const {QueryTypes} = require("sequelize");
const {separateSql, cleanFormatSelectSql, getData} = require("../helpers/slice");
const TypeScheduleModel = require('./sequelizeModel/TypeScheduleModel')

class MenuSchedulerModel extends Model {
    table = 'scheduler'
    fields = separateSql(["id", "title", "desc", "type_scheduler", "type_message", "running_at", "created_at", "created_by", "is_active"])

    constructor(select) {
        super(select)
        this.select = cleanFormatSelectSql(select).length < 1 ? this.fields : cleanFormatSelectSql(select)
    }

    async getMenuByUser(req) {
        let {limit, page} = req
        let start

        if (page == undefined || page < 1) {
            page = 1
        }

        if (limit == undefined || limit < 1) {
            limit = 10
        }

        start = (page - 1) * limit

        let query = `select sc.id,
                       sc.title,
                       sc.desc as desc_sc,
                       sc.type_scheduler,
                       sc.running_at,
                       sc.created_at,
                       sc.created_by,
                       sc.is_active,
                       sc.send_to,
                       tm.title title_tm
                from scheduler sc
                         left join template_message tm on tm.id = sc.type_message
                order by sc.created_at DESC
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

        this.select = cleanFormatSelectSql(["id", "title", "desc", "type_scheduler",
            "type_message", "send_to", "running_at",
            "created_at", "created_by", "is_active"])

        let query = `select ${this.select} from ${this.table} where title = :title limit 1`

        const resp = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                title
            }
        })

        return getData(resp)
    }

    async getType(req) {
        const {type_scheduler} = req

        this.table = 'type_scheduler'
        this.select = cleanFormatSelectSql(["id", "name"])

        let query = `select ${this.select} from ${this.table} where id = :type_scheduler limit 1`

        const resp = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                type_scheduler
            }
        })

        return getData(resp)
    }

    async getTypeSeq(req) {
        const {type_scheduler} = req

        return await TypeScheduleModel.findOne({where: {id: type_scheduler}})
    }

    async getById(req) {
        const {id} = req

        this.select = cleanFormatSelectSql(["id", "title", "desc", "type_scheduler",
            "type_message", "send_to", "running_at",
            "created_at", "created_by", "is_active"])

        let query = `select ${this.select} from ${this.table} where id = :id limit 1`
        const resp = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                id
            }
        })

        return getData(resp)
    }

    async getByIdTemplateMessage(type_message) {

        this.select = cleanFormatSelectSql(["id", "title", "desc", "type_message", "type_scheduler", "running_at", "created_at", "created_by", "is_active"])

        let query = `select ${this.select} from ${this.table} where type_message = :type_message`

        const resp = await this.conn().query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                type_message
            }
        })

        return resp
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

    async insert(req) {
        const {title, desc, running_at, is_active, type_scheduler, type_message, created_by, send_to} = req

        this.select = cleanFormatSelectSql(["title", "desc", "type_scheduler", "type_message", "running_at", "is_active", "created_at", "created_by", "send_to"])

        let query = `INSERT INTO ${this.table} (${this.select}) VALUES (:title, :desc, :type_scheduler, :type_message,:running_at, :is_active, now(), :created_by, :send_to)`

        const qExe = await this.conn().query(query, {
            type: QueryTypes.INSERT,
            replacements: {
                title, desc, type_scheduler, type_message, running_at, is_active, created_by, send_to
            }
        })

        return qExe
    }

    async toggle(req) {
        const {id, is_active, created_by} = req

        let query = `UPDATE ${this.table} SET is_active = :is_active, created_at = now(), created_by = :created_by where id = :id`

        return await this.conn().query(query, {
            type: QueryTypes.UPDATE,
            replacements: {
                id, is_active, created_by
            }
        })
    }

    async update(req) {
        const {id, title, desc, running_at, is_active, type_scheduler, created_by} = req

        this.select = cleanFormatSelectSql(["title", "desc", "type_scheduler", "running_at", "is_active", "created_at", "created_by"])
        let query = `update  ${this.table} set title = :title, desc = :desc, type_scheduler = :type_scheduler, running_at = :running_at, is_active = :is_active, created_at = now(), created_by = :created_by where id = :id`

        return await this.conn().query(query, {
            type: QueryTypes.UPDATE,
            replacements: {
                title, desc, running_at, is_active, created_by, id
            },
        })
    }

    async delete(req) {
        const {id} = req

        let query = `delete from ${this.table} where id = :id`

        return await this.conn().query(query, {
            type: QueryTypes.DELETE,
            replacements: {
                id
            },
        })
    }
}

module.exports = MenuSchedulerModel
