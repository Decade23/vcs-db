/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: databases.js
 * Last Modified: 8/19/23, 4:02 PM
 */

require("dotenv").config()

// db
const {Sequelize} = require("sequelize");
const {logger} = require("./logger");
const {errorHandler} = require("../helpers/slice");
const db = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        dialectOptions: {
            useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: true
        },
        timezone: '+07:00' //for writing to database
    })

function connectToDB() {
    try {
        db.authenticate()
            .then(() => logger.log("info", "success connect to db!"))
            .catch((e) => logger.log("error", `fail to connect db! ${e.message}`))
    } catch (e) {
        logger.error(errorHandler('unable to connect db!', {e}))
    }
}

module.exports = {
    connectToDB,
    db
}