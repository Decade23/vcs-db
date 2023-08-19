/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: messages.js
 * Last Modified: 8/19/23, 4:02 PM
 */


const {faker} = require('@faker-js/faker');
const {QueryTypes} = require("sequelize");
const {db} = require("../app/databases");
const {logger} = require("../app/logger");
const {errorHandler} = require("../helpers/slice");

function createRandomConversation() {
    return {
        from: process.env.INFOBIP_FROM,//faker.phone.number('6285#######'),
        to: process.env.INFOBIP_TO,//faker.phone.number('6287#######'),
        message: faker.random.words(10),
        message_id: faker.datatype.uuid(),
        preview_url: faker.image.imageUrl(1234, 2345, 'cat', true),
        callback_data: '',
        notify_url: '',
        created_at: faker.datatype.datetime({min: 1680066220955, max: 1680070333217}),
        created_by: faker.name.fullName()
    }
}

exports.generateFakeMessages = async (req, length = 50) => {
    let counts = 0
    let sql = "insert into messages " +
        "(`from`, `to`, `created_by`, `message`, `created_at`, `message_id`, `preview_url`) " +
        "values(:from, :to, :created_by, :message, :created_at, :message_id, :preview_url)"
    Array.from({length}).forEach(() => {

        db.query(sql, {
            replacements: {
                from: createRandomConversation().from,
                to: createRandomConversation().to,
                message: createRandomConversation().message,
                message_id: createRandomConversation().message_id,
                preview_url: createRandomConversation().preview_url,
                created_at: createRandomConversation().created_at,
                created_by: createRandomConversation().created_by,
            },
            type: QueryTypes.INSERT
        }).then(() => {
            counts++
            logger.info(`insert successfully ${counts}`)
        })
            .catch((e) => {
                logger.error(errorHandler('error insert into table', {e}))
            })
    })


    return counts

}

