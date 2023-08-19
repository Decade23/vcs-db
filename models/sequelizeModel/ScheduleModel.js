/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: ScheduleModel.js
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

class ScheduleModel extends Model {
}

ScheduleModel.init({
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
    title: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
    },
    desc: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    type_scheduler: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    type_message: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    running_at: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    send_to: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        },

    },
    created_at: {
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
        get() {
            const rawVal = this.getDataValue('created_at')
            return date(rawVal)
        }
    },
    created_by: DataTypes.STRING(50),
    is_active: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'NOT_ACTIVE', 'SUSPEND'],
    }
}, {
    sequelize,
    tableName: 'scheduler',
    modelName: 'ScheduleModel',
    timestamps: false,

})

// the defined model is the class itself
logger.info(`ScheduleModel: ${ScheduleModel === sequelize.models.ScheduleModel}`); // true

sequelize.sync(syncOptModel).then(() => {
    logger.info('scheduler table created successfully!');
}).catch((e) => {
    logger.error(errorHandler('Unable to create table scheduler', {e}));
});

module.exports = ScheduleModel
