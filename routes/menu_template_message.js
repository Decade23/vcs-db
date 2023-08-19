/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: menu_template_message.js
 * Last Modified: 8/19/23, 4:02 PM
 */


const express = require("express")

const router = express.Router()

//middleware
const {authCheck} = require("../middleware/auth")

//controllers
const Controller = require("../controllers/menu_template_message")
const controller = new Controller()

//route
router.get('/menu/template-messages/scheduler', authCheck, controller.getSC)
router.post('/menu/template-messages', authCheck, controller.get)
router.post('/menu/template-message', authCheck, controller.post)
router.post('/menu/template-message/schedule-list', authCheck, controller.scheduleList)
router.put('/menu/template-message', authCheck, controller.put)
router.delete('/menu/template-message', authCheck, controller.delete)

module.exports = router;
