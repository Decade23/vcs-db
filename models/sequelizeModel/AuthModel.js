/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: AuthModel.js
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

class AuthSeqModel extends Model {
}

AuthSeqModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid()'),
        primaryKey: true,
        allowNull: false,
    },
    user_id: DataTypes.STRING(70),
    device: DataTypes.STRING(100),
    ip: DataTypes.STRING(25),
    token: DataTypes.STRING(255),
    login_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('NOW()')
    },
    expired_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('DATE_ADD(NOW(), INTERVAL 8 HOUR)'),
        get() {
            const rawVal = this.getDataValue('expired_at')
            return date(rawVal)
        }
    },
    status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'NOT_ACTIVE', 'SUSPEND'],
        defaultValue: 'ACTIVE'
    }
}, {
    sequelize,
    tableName: 'auth',
    modelName: 'AuthSeqModel',
    timestamps: false
})

// the defined model is the class itself
logger.info(`AuthSeqModel: ${AuthSeqModel === sequelize.models.AuthSeqModel}`); // true

sequelize.sync(syncOptModel).then(() => {
    logger.info(`auth table created or already exists successfully!`);
}).catch((e) => {
    logger.error(errorHandler('Unable to create table auth', {e}));
});
//
module.exports = AuthSeqModel
