/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 3:49 PM
 * Filename: server.js
 * Last Modified: 8/6/23, 2:33 PM
 */

const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const {readdirSync} = require("fs");
const {logger} = require("./app/logger");

const Model = require("./models/model")
const {errorHandler} = require("./helpers/slice");
require("dotenv").config()


// app
const app = express()

//port
const port = process.env.PORT || 80;

async function main() {

    //connect to db
    const db = new Model()
    await db.initialize()
    await db.connectToDB()

    //middleware
    app.use(morgan("dev"));
    app.use(bodyParser.json({limit: "2mb"}));
    app.use(cors());

    // route middleware
    readdirSync("./routes").map((r) => app.use("/afccwa/api/v1", require("./routes/" + r)));

    app.listen(port, () => logger.info(`server is running on port ${port}`))
        .on('error', (e) => logger.error(errorHandler('error port: ', {e})))
}

main()