/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: seeds.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const express = require("express")

const router = express.Router()

//middleware
const {authCheck} = require("../middleware/auth")

//controllers
const {
    generateFakerUsersController,
    generateFakerMessagesController, generateSeedsController
} = require("../controllers/seeds")


//route
router.post('/seed/message', authCheck, generateFakerMessagesController)

router.post('/seed/users', authCheck, generateFakerUsersController)

router.get('/seeds/migrate', authCheck, generateSeedsController)

module.exports = router;
