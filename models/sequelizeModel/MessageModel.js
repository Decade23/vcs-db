/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: MessageModel.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const {DataTypes, Model} = require("sequelize")
const Model_ = require("../model")
const oldModel = new Model_()
const sequelize = oldModel.conn()
const {logger} = require("../../app/logger");
const {date} = require("../../helpers/format");
const {syncOptModel} = require("../../helpers/options");
const {errorHandler} = require("../../helpers/slice");

class MessageModel extends Model {
}

MessageModel.init({
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
    from: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    message_id: {
        type: DataTypes.STRING(50),
    },
    preview_url: {
        type: DataTypes.TEXT('medium'),
    },
    callback_data: {
        type: DataTypes.TEXT('medium'),
    },
    notify_url: {
        type: DataTypes.TEXT('medium'),
    },
    created_by: {
        type: DataTypes.STRING(50)
    },
    handle_by_user: {
        type: DataTypes.STRING(50)
    },
    created_at: {
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
        get() {
            const rawVal = this.getDataValue('created_at')
            return date(rawVal)
        }
    },
    created_by: DataTypes.STRING(50)
}, {
    sequelize,
    tableName: 'messages',
    modelName: 'MessageModel',
    timestamps: false,
    created_at: 'updateTimestamp'
})

// MessageModel.hasMany(ScheduleModel, {foreignKey: 'type_message', otherKey: 'id', as: 'schedule_list'})


// the defined model is the class itself
logger.info(`MessageModel: ${MessageModel === sequelize.models.MessageModel}`); // true

sequelize.sync(syncOptModel).then(() => {
    logger.info(`messages table created or already exists successfully!`);
}).catch((e) => {
    logger.error(errorHandler('Unable to create table messages', {e}));
});
//
module.exports = MessageModel
