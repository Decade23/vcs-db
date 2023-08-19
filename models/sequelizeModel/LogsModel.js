/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: LogsModel.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {DataTypes, Model, DATE} = require("sequelize")
const Model_ = require("../model")
const oldModel = new Model_()
const sequelize = oldModel.conn()
const {logger} = require("../../app/logger");
const {date} = require("../../helpers/format");
const {syncOptModel} = require("../../helpers/options");
const {errorHandler} = require("../../helpers/slice");

class LogsModel extends Model {
}

LogsModel.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
    action: DataTypes.TEXT,
    data: DataTypes.TEXT,
    created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('current_timestamp()'),
        get() {
            const rawVal = this.getDataValue('created_at')
            return date(rawVal)
        }
    }
}, {
    sequelize,
    tableName: 'logs',
    modelName: 'LogsModel',
    timestamps: false
})

// the defined model is the class itself
logger.info(`LogsModel: ${LogsModel === sequelize.models.LogsModel}`); // true

sequelize.sync(syncOptModel).then(() => {
    logger.info(`logs table created or already exists successfully!`);
}).catch((e) => {
    logger.error(errorHandler('Unable to create table logs', {e}));
});
//
module.exports = LogsModel
