/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: menu_scheduler.js
 * Last Modified: 8/19/23, 3:49 PM
 */ttp = require("./http")
const MenuSchdulerMdl = require("../models/menu_scheduler")
const {getAuthUser} = require("../helpers/authentication");
const {logger} = require("../app/logger");
const {isHasObject, errorHandler} = require("../helpers/slice");
const Scheduler = require("../helpers/scheduler")
const {transformerPagination} = require("../transform/menu/SchedulerTransform");

class MenuSchedulerHttp extends Http {
    params = ''

    constructor(params) {
        super();
        this.params = params
    }

    async get(req) {
        try {
            const mdl = new MenuSchdulerMdl()
            return transformerPagination(await mdl.getByUserPagination(req))
        } catch (e) {
            logger.error(errorHandler('', {e}))
            return {'error': e.message}
        }

    }

    async post(req) {
        const user = getAuthUser(req)

        //  destructure params
        const {title, desc, running_at, count_call, type_scheduler, template_message, enabled, send_to} = req.body
        const created_by = user.id
        const is_active = enabled ? 'ACTIVE' : 'NOT_ACTIVE'

        //  destructure params for db
        let payloadIntoDB = {
            title, desc, is_active, type_scheduler, created_by, send_to, count_call,
            running_at: JSON.stringify(running_at),
            type_message: template_message
        }

        try {
            // init model
            const messageModel = new MenuSchdulerMdl()
            const check = await messageModel.getByTitle(req.body)

            // if title already taken return error
            if (Object.keys(check).length > 0) {
                return {'error': 'title already taken'}
            }

            // insert into db
            await messageModel.insert(payloadIntoDB)

            // do scheduler/cron if directly active
            // init scheduler

            // get job scheduler just insert
            const job = await messageModel.getByTitle(payloadIntoDB)

            // then create job
            const sch = new Scheduler()
            const schduler = sch.createJob(job)

            // error job handling
            sch.errorJob(schduler, job)

            // end of create scheduler

            // return success
            return {'success': 'insert', 'statusCronFromClient': is_active, 'createJob': schduler}
        } catch (e) {
            logger.error(errorHandler('', {e}))
            return {'error': e.message}
        }

    }

    async toggle(req) {
        const user = getAuthUser(req)

        //  destructure params
        const {id, is_active} = req.body
        const created_by = user.id


        try {
            //  destructure params for db
            let payloadIntoDB = {
                id, is_active, created_by
            }

            // init model
            const messageModel = new MenuSchdulerMdl()

            // do toggle scheduler/cron
            // get row by id
            const scheduler = await messageModel.getById(req.body)
            scheduler.created_by = payloadIntoDB.created_by
            scheduler.is_active_old = scheduler.is_active
            scheduler.is_active = payloadIntoDB.is_active

            // do toggle
            const err = await new Scheduler().toggleHandler(scheduler)

            // if do toggle error
            if (err?.error) return {'error': err?.error}

            return {'success': 'toggle scheduler'}
        } catch (e) {
            logger.error(errorHandler('', {e}))
            return {'error': e.message}
        }

    }

    async put(req) {
        const user = getAuthUser(req)

        //  destructure params
        const {title, desc, running_at, is_active} = req.body
        const created_by = user.id

        try {
            // init model
            const messageModel = new MenuSchdulerMdl()
            const check = await messageModel.getById(req.body)

            // if exists, update into db
            if (Object.keys(check).length > 0) {
                let payloadIntoDB = {
                    "id": check.id,
                    title, desc, running_at, is_active, type_scheduler,
                    created_by
                }

                // check if title already taken by scheduler others
                const checkTitle = await messageModel.getByTitle(payloadIntoDB)

                // if name already taken return empty object
                if (Object.keys(checkTitle).length > 0) {
                    return {'error': 'title already taken'}
                }

                // update row
                await messageModel.update(payloadIntoDB)
                return {'success': 'update'}
            }

            return {'error': 'fail to update'}
        } catch (e) {
            return {'error': e.message}
        }
    }

    async delete(req) {

        try {
            // init model
            const messageModel = new MenuSchdulerMdl()

            // shutdown job/cron. if running...
            // get row of schduler
            const check = await messageModel.getById(req.body)

            // check row if exist
            if (isHasObject(check)) {
                // then, shutdown it.
                if (check.is_active === "ACTIVE") {
                    new Scheduler().cancelJob(check.id)
                }

            }

            // delete row
            await messageModel.delete(req.body)
            return {'success': 'delete'}

        } catch (e) {
            return {'error': e.message}
        }
    }

}

module.exports = MenuSchedulerHttp
