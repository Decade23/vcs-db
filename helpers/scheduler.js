/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: scheduler.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const schedule = require('node-schedule');

const MenuSchedulerModel = require("../models/menu_scheduler")
const {logger} = require("../app/logger");
const MenuSchdulerMdl = require("../models/menu_scheduler");
const {errorHandler} = require("./slice");
const Messages = require('../models/messages')
const WaHttp = require('../http/wa')
const {sleep} = require("./timer");
const TemplateMessageModel = require('../models/sequelizeModel/TemplateMessageModel')
const LogSchedulerModel = require('../models/sequelizeModel/LogSchedulerModel')
const {waFormat} = require("./format");

class Scheduler {
    type = ["RANGE_DATE", "EVERY_DATE", "EACH_TIME"]

    constructor(type) {
        this.type = type
    }

    async errorJob(scheduler, job) {
        if (scheduler?.error) {
            logger.error(JSON.stringify(scheduler))
            this.toggleHandler(job)
        }
    }

    async toggleHandler(job) {
        try {

            // init model
            const messageModel = new MenuSchdulerMdl()

            // toggle job/scheduler
            await messageModel.toggle(job)

            // if toggle not_active or suspend
            // IS_ACTIVE NEW
            if (job?.is_active === "NOT_ACTIVE" || job?.is_active === "SUSPEND") {

                // IS_ACTIVE OLD
                // if previous already not_active will not be cancel
                if (job?.is_active_old === "ACTIVE") {
                    this.cancelJob(job.id)
                }

            } else {
                //create job. if is_active is not_active will automatic not run job
                // then create job
                const sch = new Scheduler()
                const schduler = sch.createJob(job)

                //error handle job
                sch.errorJob(schduler, job)
            }
        } catch (e) {
            logger.error(errorHandler('', {e}))
            return {'error': e.message}
        }
    }

    createJob(job) {
        try {
            if (job.is_active === "ACTIVE") {
                this.runJob(job)
                return
            }
            const msg = job.is_active === "NOT_ACTIVE" ? 'you are choose not running job' : 'fail run job/scheduler'
            return {'error': {'status_job': msg, 'message': 'try to enable job/scheduler later.'}}
        } catch (e) {
            logger.error(errorHandler('', {e}))
            return {'error': e.message}
        }
    }

    async transformJobByType(req) {
        const {running_at} = req
        const response = {
            running_at
        }
        // get type from db
        const mdl = new MenuSchedulerModel()
        const schedulerType = await mdl.getTypeSeq(req)

        // match condition with type of scheduler
        // run if active is true
        switch (schedulerType.name) {
            case "RANGE_DATE": // id: 1
                // do job
                // It will run after 5 seconds and stop after 10 seconds in this example

                // const startTime = new Date(Date.now() + 5000);
                // const endTime = new Date(startTime.getTime() + 5000);

                const startTime = new Date(running_at.start);
                const endTime = new Date(running_at.end);
                const hourTime = new Date().getHours();
                const minuteTime = new Date().getMinutes();
                const timeTime = new Date().getTime();
                //const rule = '*/1 * * * * *'

                // response.running_at = {start: startTime, end: endTime, rule}
                response.running_at = {
                    start: startTime, end: endTime, hour: hourTime, minute: minuteTime, time: timeTime
                }
                break
            case "EVERY_DATE": // id: 2
                // every Sunday at 2:30pm

                let rule = {
                    hour: "09", minute: "00"
                }
                // dow = day of weeks
                const {every_time, dow} = JSON.parse(running_at)
                const hourMinute = every_time.split(":")

                // destructure time
                const [hour, minute] = [hourMinute[0], hourMinute[1]]
                rule.hour = hour
                rule.minute = minute

                // get day of weeks
                // if dow not every_day
                if (dow !== "every_day") {
                    rule.dayOfWeek = dow
                }

                response.running_at = rule
                break
            case "EACH_TIME": // id: 3
                // destructure
                const runningAt = JSON.parse(running_at)
                // do job

                response.running_at = runningAt.every_time
                break
            default:
                break
        }

        return response
    }

    async shutdownAllJob() {
        try {
            schedule.gracefulShutdown()
        } catch (e) {
            logger.error(errorHandler('shutdown all jobs', {e}))
        }
    }

    async cancelJob(id) {
        try {
            let job = schedule.scheduledJobs[id]

            job.cancel()
        } catch (e) {
            logger.error(errorHandler('cancel job by id', {e}))
        }
    }

    async rescheduleJob(scheduler) {
        try {
            const {id, running_at} = scheduler
            let job = schedule.scheduledJobs[id]

            job.reschedule(running_at)
        } catch (e) {
            logger.error(errorHandler('reschedule job', {e}))
        }
    }

    // default running job every 10 minutes
    async afterCallPredictiveJob({job = {}, running_at = '*/10 * * * *'}) {
        running_at = '*/1 * * * *'
        console.log({jobTest: job, jobId: job.id})
        try {
            const messages = new Messages()
            const wa = new WaHttp()

            const templateMessage = await TemplateMessageModel.findOne({
                where: {id: job.type_message} // error disini nih
            }).catch((e) => logger.error(errorHandler(`error get template message`, e)))

            if (templateMessage !== null) {
                schedule.scheduleJob(job.id, running_at, async function () {
                    try {
                        // engine call

                        // check rows call
                        const listsAfterCall = await messages.listsAfterCallPredictiveV2(job)

                        if (listsAfterCall.length > 0) {
                            listsAfterCall.map(async (v) => {
                                let text_message = templateMessage.message.replaceAll('__name__', v.cust_name)


                                const reqSentWa = {
                                    to: v.phone_number,
                                    text: text_message
                                }

                                // sleep 0.5 seconds
                                // await sleep(2000)

                                // if (job.running_at.count_call === v.total_call)
                                // send message wa
                                // already convert from json into string

                                // first check if already sent message to the same moment
                                const logSentWa = await LogSchedulerModel.findOne({
                                    where: {
                                        customer_phone: v.phone_number,
                                        total_call: v.total_call,
                                        status_call: job.send_to.toLowerCase()
                                    }
                                })

                                if (logSentWa === null) {

                                    const resp = await wa.onlySendingWa(reqSentWa)

                                    const payloadLog = {
                                        customer_phone: v.phone_number,
                                        prospect_id: v.prospect_id,
                                        total_call: job.running_at.count_call,
                                        response_sender: resp,
                                        status_call: job.send_to.toLowerCase(),
                                        text_message
                                    }

                                    await LogSchedulerModel
                                        .create(payloadLog)
                                        .catch((e) => logger.error(errorHandler(`error insert log send wa blast`, e)))
                                }

                            })
                        }

                        // end of engine call

                        // agent call
                        const listsAgentCall = await messages.listsAfterCallAgent(job)

                        if (listsAgentCall.length > 0) {
                            listsAgentCall.map(async (v) => {
                                let text_message = templateMessage.message.replaceAll('__name__', v.cust_name)


                                const reqSentWa = {
                                    to: v.phone_number,
                                    text: text_message
                                }

                                // sleep 0.5 seconds
                                // await sleep(2000)

                                // if (job.running_at.count_call === v.total_call)
                                // send message wa
                                // already convert from json into string

                                // first check if already sent message to the same moment
                                const logSentWa = await LogSchedulerModel.findOne({
                                    where: {
                                        customer_phone: v.phone_number,
                                        total_call: v.total_call,
                                        status_call: job.send_to.toLowerCase()
                                    }
                                })

                                if (logSentWa === null) {

                                    const resp = await wa.onlySendingWa(reqSentWa)

                                    const payloadLog = {
                                        customer_phone: v.phone_number,
                                        prospect_id: v.prospect_id,
                                        total_call: job.running_at.count_call,
                                        response_sender: resp,
                                        status_call: job.send_to.toLowerCase(),
                                        text_message
                                    }

                                    await LogSchedulerModel
                                        .create(payloadLog)
                                        .catch((e) => logger.error(errorHandler(`error insert log send wa blast`, e)))
                                }

                            })
                        }

                        // end of agent call

                    } catch (e) {
                        logger.error(errorHandler('error process job', {e}))
                    }
                });
            } else {
                logger.error('error run job: template message not found!')
            }
        } catch (e) {
            logger.error(errorHandler('error run job predictive', {e}))
        }

    }

    async runJob(job) {
        try {
            const {running_at} = await this.transformJobByType(job)

            // RANGE_DATE
            if (job.type_scheduler === 1) {
                return
            }

            // EVERY_DATE
            if (job.type_scheduler === 2) {
                let c = 0
                schedule.scheduleJob(job.id, running_at, function () {
                    console.log(`The answer to life, the universe, and everything! ${c++} ${new Date()}`);
                });
                return
            }

            // EACH_TIME
            if (job.type_scheduler === 3) {
                // transform string into json
                job.running_at = JSON.parse(job.running_at)
                await this.afterCallPredictiveJob({job, running_at})

            }
        } catch (e) {
            logger.error(errorHandler('error run job', {e}))
        }


    }

}

module.exports = Scheduler