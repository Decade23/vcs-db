/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: menu_scheduler.js
 * Last Modified: 8/19/23, 4:02 PM
 */


const express = require("express")

const router = express.Router()

//middleware
const {authCheck} = require("../middleware/auth")

//controllers
const Controller = require("../controllers/menu_scheduler")
const controller = new Controller()

//route
router.post('/menu/schedulers', authCheck, controller.get)
router.post('/menu/scheduler', authCheck, controller.post)
router.post('/menu/scheduler/toggle', authCheck, controller.toggle)
router.put('/menu/scheduler', authCheck, controller.put)
router.delete('/menu/scheduler', authCheck, controller.delete)

module.exports = router;
