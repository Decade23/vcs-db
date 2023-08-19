/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: user.js
 * Last Modified: 8/19/23, 4:02 PM
 */


const express = require("express")

const router = express.Router()

//middleware
const {authCheck} = require("../middleware/auth")

//controllers
const userController = require("../controllers/user")


//route
router.get('/users', authCheck, new userController().get)

module.exports = router;