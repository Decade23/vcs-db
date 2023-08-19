/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: users.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {faker} = require('@faker-js/faker');
const {db} = require("./../app/databases");
const {QueryTypes} = require("sequelize");
const {logger} = require("../app/logger");
const {errorHandler} = require("../helpers/slice");


const table = 'users';
const type = {
    customer: 1,
    admin_cabang: 2
}

function objUsers() {
    return {
        name: faker.name.firstName(),
        type: type.customer,
        phone_number: faker.phone.number("6285#######"),
        created_at: faker.date.betweens('2023-03-28T00:00:00.000Z', '2023-12-29T00:00:00.000Z'),
        created_by: 'system'
    }
}

exports.generateFakeUsers = async (req, length = 50) => {
    var counts = 0
    Array.from({length}).forEach(() => {

        let sql = "insert into users " +
            "(`name`, `type`, `created_by`, `phone_number`) " +
            "values(:name, :type, :created_by, :phone_number)"


        db.query(sql, {
            replacements: {
                name: objUsers().name,
                type: objUsers().type,
                created_by: objUsers().created_by,
                phone_number: objUsers().phone_number,
                // created_at: objUsers().created_at
            },
            type: QueryTypes.INSERT
        }).then(() => {
            counts++
            logger.info(`insert into table ${table} successfully. counts: ${counts}`)
        })
            .catch((e) => {
                logger.error(errorHandler('error insert into table', {e}))
            })
    })

    return counts

}
