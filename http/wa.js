/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: wa.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const Http = require("./http")
const Messages = require("../models/messages")
const Logs = require("../models/logs")
const {getAuthUser} = require("../helpers/authentication");
const {date, dateWAESB, dateWAESBNOW, unixCustom} = require("../helpers/format");
const {errorHandler} = require("../helpers/slice");
const {logger} = require("../app/logger");

class WaHttp extends Http {

    constructor() {
        super();
    }

    async getWa(req) {
        const mdl = new Messages()
        return await mdl.getMessageByUserPagination(req)
    }

    async getWaConversation(req) {
        const mdl = new Messages()
        return await mdl.getMessageConversation(req)
    }

    async sentWa(req) {
        const user = getAuthUser(req)
        const created_by = user.id
        const {to, text} = req

        let payload = {
            from: process.env.INFOBIP_FROM, to, messageId: "", content: {
                text, previewUrl: ""
            }, callbackData: "", notifyUrl: "",
        }

        // sent message
        const resSentMessage = await this.axios.post(`${process.env.INFOBIP_URL}/whatsapp/1/message/text`, payload, this.config)

        const {messageId} = resSentMessage.data

        // store log result sent message
        const log = new Logs()

        let payloadLog = {
            action: 'wa_sent_message', data: JSON.stringify(resSentMessage.data)
        }

        // insert log into db
        await log.insert(payloadLog)

        // restructure data into db
        let {previewUrl} = payload.content
        let {from, callbackData, notifyUrl} = payload
        let payloadIntoDB = {
            from,
            to,
            message: text,
            message_id: messageId,
            preview_url: previewUrl,
            callback_data: callbackData,
            notify_url: notifyUrl, // created_at: "2023-03-29 19:31:30",
            created_by: created_by,
            handle_by_user: created_by
        }

        // insert message into db
        const messageModel = new Messages()
        await messageModel.insertMessageSeq(payloadIntoDB)
        return {'success': 'insert'}
    }

    async sentWaViaAdr(req) {
        const user = getAuthUser(req)
        const created_by = user.id
        const {to, text} = req

        let payload = {
            "header": {
                "requestId": `CC-${unixCustom()}`,
                "requestTimestamp": dateWAESBNOW(),
                "costGrp": this.channel,
                "appNo": unixCustom(),
                "channelId": this.channel
            }, "data": {
                "from": this.fromNumber, to, "messageId": "a28dd97c-1ffb-4fcf-99f1-0b557ed381da", "content": {
                    text
                }, "callbackData": "callback data"
            }
        }

        // sent message
        const resSentMessage = await this.axios.post(`${this.urlAdr}/api/i5/infobip/v1/sendwatext`, payload, this.configAdr)

        const {messageId} = resSentMessage.data

        // store log result sent message
        const log = new Logs()

        let payloadLog = {
            action: 'wa_sent_message_adr', data: JSON.stringify(resSentMessage.data)
        }

        // insert log into db
        await log.insert(payloadLog)

        // restructure data into db
        let {previewUrl} = payload.content
        let {from, callbackData, notifyUrl} = payload
        let payloadIntoDB = {
            from,
            to,
            message: text,
            message_id: messageId,
            preview_url: previewUrl,
            callback_data: callbackData,
            notify_url: notifyUrl, // created_at: "2023-03-29 19:31:30",
            created_by: created_by,
            handle_by_user: created_by
        }

        // insert message into db
        const messageModel = new Messages()
        await messageModel.insertMessageSeq(payloadIntoDB)
        return {'success': 'insert'}
    }

    async onlySendingWa(req) {
        const {to, text} = req

        let payload = {
            from: process.env.INFOBIP_FROM, to, messageId: "", content: {
                text, previewUrl: ""
            }, callbackData: "", notifyUrl: "",
        }

        try {
            // sent message
            const response = await this.axios.post(`${process.env.INFOBIP_URL}/whatsapp/1/message/text`, payload, this.config)

            logger.info(`send wa success: ${JSON.stringify(response.data)}`)

            return JSON.stringify(response.data)
        } catch (e) {

            logger.error(errorHandler(`error send wa to infobip ${e}`, e))
            return `failed sent wa ${e}`
        }
    }
}

module.exports = WaHttp
