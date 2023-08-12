/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: wa.js
 * Last Modified: 8/19/23, 3:49 PM
 */xpress = require("express")

const router = express.Router()

//middleware
const {authCheck} = require("../middleware/auth")

//controllers
const WaController = require("../controllers/wa")
const waController = new WaController()

//route
router.get('/messages', authCheck, waController.get)
router.get('/messages/conversation', authCheck, waController.getConversation)
router.post('/message', authCheck, waController.sent)

module.exports = router;
