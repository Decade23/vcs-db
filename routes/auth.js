/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: auth.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const express = require("express")

const router = express.Router()

// middleware
const {authCheck} = require("../middleware/auth");

//controllers
const AuthController = require("../controllers/auth")
const authController = new AuthController()

//route
router.get('/login', authCheck, authController.get)
router.post('/login', authController.login)
router.post('/me', authCheck, authController.me)

module.exports = router;
