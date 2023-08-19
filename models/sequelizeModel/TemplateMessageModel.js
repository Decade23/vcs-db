/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: TemplateMessageModel.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {DataTypes, Model} = require("sequelize")
const Model_ = require("../model")
const oldModel = new Model_()
const sequelize = oldModel.conn()
const ScheduleModel = require('./ScheduleModel')
const {logger} = require("../../app/logger");
const {date} = require("../../helpers/format");
const {syncOptModel} = require("../../helpers/options");
const {errorHandler} = require("../../helpers/slice");

class TemplateMessageModel extends Model {
}

TemplateMessageModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid()'),
        validate: {
            notEmpty: true,
            isUUID: 4
        },
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
    },
    message: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            const rawVal = this.getDataValue('created_at')
            return date(rawVal)
        }
    },
    created_by: DataTypes.STRING(50)
}, {
    sequelize,
    tableName: 'template_message',
    modelName: 'TemplateMessageModel',
    timestamps: false,
    // created_at: 'updateTimestamp'
})

// TemplateMessageModel.hasMany(ScheduleModel, {foreignKey: 'type_message', otherKey: 'id', as: 'schedule_list'})
TemplateMessageModel.hasMany(ScheduleModel, {
    foreignKey: 'type_message',
    otherKey: 'id', as: 'schedule_list',
    constraints: false
})


// the defined model is the class itself
logger.info(`TemplateMessageModel: ${TemplateMessageModel === sequelize.models.TemplateMessage}`); // true

sequelize.sync(syncOptModel).then(() => {
    logger.info(`template_message table created or already exists successfully!`);
}).catch((e) => {
    logger.error(errorHandler('Unable to create table template_message', {e}));
});
//
module.exports = TemplateMessageModel
