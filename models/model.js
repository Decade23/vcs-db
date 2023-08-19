/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:02 PM
 * Filename: model.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {Sequelize} = require("sequelize");
const {logger} = require("../app/logger");
const {sleep} = require("../helpers/timer");
const mysql = require('mysql2/promise')
const {errorHandler} = require("../helpers/slice");
const {syncOptModel} = require("../helpers/options");

// const AuthModel = require("./sequelizeModel/AuthModel")

class Model {

    table = ''
    fields = ["*"]
    host = process.env.DATABASE_HOST
    dialect = process.env.DATABASE_DIALECT
    port = process.env.DATABASE_PORT
    user = process.env.DATABASE_USER
    password = process.env.DATABASE_PASSWORD
    database = process.env.DATABASE

    constructor(select) {
        this.count = 1
        this.maxRetry = 10
        this.timer = 2000 // 2 second

        this.select = this.cleanFormatSelectSql(select).length < 1 ? this.fields : this.cleanFormatSelectSql(select)
    }

    // db = {}

    dbConf = new Sequelize(this.database, this.user, this.password, {
        host: this.host, port: this.port, dialect: this.dialect, // dialectOptions: {
        //     useUTC: false, //for reading from database
        //     dateStrings: true,
        //     typeCast: true
        // },
        timezone: '+07:00' //for writing to database
    })

    conn() {
        return this.dbConf
    }

    set #counter(value) {
        return this.count++
    }

    get #counter() {
        return this.count
    }

    separateSql(arr) {
        let format = arr != undefined ? "`" + arr.join("`,`") + "`" : []
        return format
    }

    cleanFormatSelectSql(v) {
        return this.separateSql(typeof v == 'string' ? v.replace(/\s/g, "").trim().split(",") : v)
    }

    async initialize() {
        // check if database not exist then create it.
        try {
            const connection = await mysql.createConnection({
                host: this.host, port: this.port, user: this.user, password: this.password
            })
            const connMsg = await connection.query(`CREATE DATABASE IF NOT EXISTS ${this.database}`)
            logger.info(`create db: ${JSON.stringify(connMsg)}`)
        } catch (e) {
            logger.error(errorHandler('failed to create database', {e}))
        }
    }

    async connectToDB() {

        for (; ;) {
            try {
                await this.dbConf.authenticate()

                // const seq = this.dbConf
                // // init models and add them to the exported db object
                // this.db.Auth = require('./sequelizeModel/AuthModel')(seq)
                // this.db.LogsModel = require('./sequelizeModel/LogsModel')(seq)
                // this.db.MessageModel = require('./sequelizeModel/MessageModel')(seq)
                // this.db.TypeScheduleModel = require('./sequelizeModel/TypeScheduleModel')(seq)
                // this.db.ScheduleModel = require('./sequelizeModel/ScheduleModel')(seq)
                // this.db.TemplateMessageModel = require('./sequelizeModel/TemplateMessageModel')(seq)
                //
                // // sync all models with database
                // await seq.sync(syncOptModel)

                logger.info("success. connect to db!")
                return false
            } catch (e) {

                logger.error(`trying to connect db... ${this.count}`)

                await sleep(this.timer)
                this.count++

                if (this.count > this.maxRetry) {
                    logger.error(`unable to connect to db! ${e}`)
                    return false
                }

            }
        }

    }
}

module.exports = Model
