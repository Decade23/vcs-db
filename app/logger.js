/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: logger.js
 * Last Modified: 8/6/23, 2:33 PM
 */
const winston = require("winston");
const {format} = require("winston");
const {combine, timestamp, label, printf} = format;

const folder = './logs/';
const date = `${new Date().getMonth() + 1}${new Date().getFullYear()}`;
const filename = `${folder}${date}`;

const logFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        label({label: "afccwa"}),
        timestamp(
            {format: "DD-MMM-YYYY HH:mm:ss"}
        ),
        logFormat,
        // format.json(),
        format.colorize()
    ),
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console({level: 'error'}),
        new winston.transports.File({
            filename: filename + 'info.log',
            level: "info",
            maxsize: '5mb'
        }),
        new winston.transports.File({
            filename: filename + 'error.log',
            level: "error",
            maxsize: '5mb'
        }),

    ]
})


module.exports = {
    logger
}