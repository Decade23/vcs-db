/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: LogSchedulerModel.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {DataTypes, Model} = require("sequelize")
const {logger} = require("../../app/logger");
const {date} = require("../../helpers/format");
const {syncOptModel} = require("../../helpers/options");
const Model_ = require("../model")
const {errorHandler} = require("../../helpers/slice");
const oldModel = new Model_()
const sequelize = oldModel.conn()

const table_name = 'log_scheduler'

class LogSchedulerModel extends Model {

}

LogSchedulerModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid()'),
        validate: {
            notEmpty: true,
            isUUID: 4
        },
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
    customer_phone: {
        type: DataTypes.STRING(75),
        allowNull: false,
    },
    prospect_id: {
        type: DataTypes.STRING(75),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    total_call: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    status_call: {
        type: DataTypes.STRING(30)
    },
    text_message: {
        type: DataTypes.TEXT
    },
    response_sender: {
        type: DataTypes.TEXT
    },
    created_at: {
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
        get() {
            const rawVal = this.getDataValue('created_at')
            return date(rawVal)
        }
    },
    created_by: {
        type: DataTypes.STRING(50),
        defaultValue: 'SCHEDULER_BLAST_WA'
    },
}, {
    sequelize,
    tableName: table_name,
    modelName: 'LogSchedulerModel',
    timestamps: false,

})

// the defined model is the class itself
logger.info(`LogSchedulerModel: ${LogSchedulerModel === sequelize.models.LogSchedulerModel}`); // true

sequelize.sync(syncOptModel).then(() => {
    logger.info(`${table_name} table created successfully!`);
}).catch((e) => {
    logger.error(errorHandler(`Unable to create table ${table_name}`, {e}));
});

module.exports = LogSchedulerModel
