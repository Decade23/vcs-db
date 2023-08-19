/*
 * Author: Dedi Fardiyanto Copyright (c) 2023.
 *
 * Created At: 8/19/23, 4:10 PM
 * Filename: auth.js
 * Last Modified: 8/19/23, 4:02 PM
 */

const Http = require("./http")
const CCUser = require("../models/cc_user")
const Logs = require("../models/logs")
const Auth = require("../models/auth")
const crypto = require("crypto");
const {getIp, getToken, errorHandler} = require("../helpers/slice");
const jwt = require("jsonwebtoken")
const {logger} = require("../app/logger");


class AuthHttp extends Http {

    constructor() {
        super();
    }

    async get(req) {
        const mdl = new CCUser()
        return await mdl.getModelPagination(req)
    }

    async me(req) {
        const mdl = new CCUser()

        // set token to req
        req.token = getToken(req)

        return await mdl.me(req)
    }


    async login(req) {


        try {
            let getip = getIp(req)
            let deviceInfo = req.headers["user-agent"]
            req = req.body

            // restructure param
            req.user_id = req.username
            req.ip = getip
            req.device = deviceInfo
            req.password = crypto.createHash("sha256").update(req.password).digest("hex")
            const {username, password} = req

            // init cc user model
            const ccUser = new CCUser()

            let payload = {
                username, password
            }

            // check user on db
            let user = await ccUser.getUserByUsernameAndPassword(payload)

            // return array object of user
            if (user.length > 0) {
                // split into object of user
                user = user[0]

                // check if user object has property
                if (Object.keys(user).length > 0) {

                    //check if user not in auth
                    const payload = {user_id: user.id}
                    req.token = jwt.sign(user, process.env.AUTH_TOKEN, {expiresIn: '8h'})

                    const {user_id, device, ip, token} = req
                    const payloadAuth = {user_id, device, ip, token}
                    const auth = new Auth()
                    if (!await auth.hasAuth(payload)) {
                        // store to auth
                        // await auth.insert(payloadAuth)
                        await auth.insertSequelize(payloadAuth)
                    } else {
                        // update auth if already have logged in
                        await auth.update(payloadAuth)
                    }


                    // store log result sent message
                    const log = new Logs()

                    let payloadLog = {
                        action: 'login_wa',
                        data: JSON.stringify(user)
                    }

                    // insert log into db
                    // await log.insert(payloadLog)
                    await log.insertSequelize(payloadLog)

                    // check if user not active or suspend by super admin
                    // if user not active or suspend return true
                    if (!await auth.checkStatusAuth(payload)) {
                        return {}
                    }

                    // if success logged in return object of user
                    // user = {...user, ...payloadAuth}
                    return {token, 'name': user.name}
                }

            }
            logger.info('success login')
            return {'success': 'login'}
        } catch (e) {
            logger.error(errorHandler('', {e}))
            return {'error': e.messages}
        }
    }
}

module.exports = AuthHttp
