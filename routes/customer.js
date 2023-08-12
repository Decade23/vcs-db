/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: customer.js
 * Last Modified: 8/19/23, 3:49 PM
 */uire("express")

const router = express.Router()

//middleware
const {authCheck} = require("../middleware/auth")

//controllers
const Controller = require("../controllers/customerController")
const controller = new Controller()

//route
router.post('/customers', authCheck, controller.getCustomers)
router.post('/customers/search', authCheck, controller.getCustomersSearch)
router.post('/customers/lists-status-call', authCheck, controller.getCustomersListStatusCall)
router.post('/customer/by-status-call', authCheck, controller.getCustomerByStatusCall)
router.post('/customer/by-status-call/count', authCheck, controller.getCustomerByStatusCallCount)

module.exports = router;
