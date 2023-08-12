/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: TypeScheduleModel.js
 * Last Modified: 8/19/23, 3:49 PM
 */ {DataTypes, Model} = require("sequelize")
const Model_ = require("../model")
const {logger} = require("../../app/logger");
const {syncOptModel} = require("../../helpers/options");
const {errorHandler} = require("../../helpers/slice");
const oldModel = new Model_()
const sequelize = oldModel.conn()

class TypeScheduleModel extends Model {
}

TypeScheduleModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        // values: ['RANGE_DATE', 'EVERY_DATE', 'EACH_TIME'],
        allowNull: false,
        unique: true,
    }
}, {
    sequelize,
    tableName: 'type_scheduler',
    modelName: 'TypeScheduleModel',
    timestamps: false
})

// the defined model is the class itself
logger.info(`TypeScheduleModel: ${TypeScheduleModel === sequelize.models.TypeScheduleModel}`); // true

sequelize.sync(syncOptModel).then(async () => {
    const type = await TypeScheduleModel.bulkCreate([
        {name: 'RANGE_DATE'},
        {name: 'EVERY_DATE'},
        {name: 'EACH_TIME'}
    ])
    logger.info(`success created type_scheduler: ${JSON.stringify(type)}`)
    logger.info('type_scheduler table created successfully!');
}).catch((e) => {
    logger.error(errorHandler('Unable to create table type_scheduler', {e}));
});

module.exports = TypeScheduleModel
