/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: menu_template_message.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const Http = require("./http")
const MenuTemplateMessageModel = require("../models/menu_template_message")
const MenuScheduleModel = require("../models/menu_scheduler")
const ScheduleModel = require("../models/sequelizeModel/ScheduleModel")
const TemplateMessageModel = require("../models/sequelizeModel/TemplateMessageModel")
const {getAuthUser} = require("../helpers/authentication");
const {transformerPagination, transformerPaginationSeq} = require("../transform/menu/TemplateMessageMenuTransform");
const {logger} = require("../app/logger");
const Model_ = require('../models/model')
const {errorHandler} = require("../helpers/slice");
const oldModel = new Model_()
const sequelize = oldModel.conn()

class MenuTemplateMessageHttp extends Http {

    constructor() {
        super();
    }

    async getTM(req) {
        const mdl = new MenuTemplateMessageModel()
        // return transformerPagination(await mdl.getByUserPagination(req))
        return transformerPaginationSeq(await mdl.getTMSequelize(req))
    }

    async getTMSC(req) {
        const mdl = new MenuTemplateMessageModel()
        return await mdl.getMenuTMForScheduler(req)
    }

    async post(req) {
        const user = getAuthUser(req)

        const {title, message} = req.body
        const created_by = user.id
        let payloadIntoDB = {
            title,
            message,
            created_by
        }

        try {
            // insert message into db
            const messageModel = new MenuTemplateMessageModel()
            const check = await messageModel.getByTitle(req.body)

            // if name already taken return empty object
            if (Object.keys(check).length > 0) {
                return {'error': 'title already taken'}
            }

            // insert into db
            await messageModel.insertMessage(payloadIntoDB)
            return {'success': 'insert'}
        } catch (e) {
            return {'error': e.message}
        }

    }

    async scheduleList(req) {

        const {id_template_message} = req.body

        try {

            // insert message into db
            const mdl = new MenuScheduleModel()

            return await mdl.getByIdTemplateMessage(id_template_message)

            //return await TemplateMessageModel.findByPk(id_template_message, {include: 'schedule_list'})

        } catch (e) {
            logger.error(errorHandler('error', {e}))
            return {'error': e.message}
        }

    }

    async put(req) {
        const user = getAuthUser(req)

        const {title, message} = req.body
        const created_by = user.id

        try {
            // insert message into db
            const messageModel = new MenuTemplateMessageModel()
            const check = await messageModel.getById(req.body)

            // if name already taken update into db
            if (Object.keys(check).length > 0) {
                let payloadIntoDB = {
                    "id": check.id,
                    title,
                    message,
                    created_by
                }

                // check if title already taken by template messages others
                const checkTitle = await messageModel.getByTitle(payloadIntoDB)

                // if name already taken return empty object
                if (Object.keys(checkTitle).length > 0) {
                    return {'error': 'title already taken'}
                }

                // insert into db
                await messageModel.updateMessage(payloadIntoDB)
                return {'success': 'update'}
            }

            return {'error': 'fail to update'}
        } catch (e) {
            return {'error': e.message}
        }
    }

    async delete(req) {

        try {
            // insert message into db
            const messageModel = new MenuTemplateMessageModel()

            // insert into db
            await messageModel.deleteMessage(req.body)
            return {'success': 'delete'}

        } catch (e) {
            return {'error': e.message}
        }
    }

}

module.exports = MenuTemplateMessageHttp
