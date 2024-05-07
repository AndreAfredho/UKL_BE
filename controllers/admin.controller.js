const adminModel = require('../models/index').admin
const md5 = require('md5')
const where = require("sequelize").Op
const Op = require("sequelize").Op
const jwt = require('jsonwebtoken')
const secret = 'Sabar Masku'


exports.registerAdmin = async (request, response) => {
    try {
        //check if the email is alredy registered
        const existingUser = await adminModel.findOne({
            where: { email: request.body.email },
        });

        if (existingUser) {
            return response.json({
                success: false,
                message: "email is alredy registered, submit different email address",
            });
        }

        //prepare data from request for new user 
        let newUser = {
            name: request.body.name,
            email: request.body.email,
            password: md5(request.body.password),
            roel: request.body.role
        }

        //execute inserting data to user's table 
        const result = await adminModel.create(newUser);

        return response.json({
            success: true,
            data: result,
            message: "register new user success",
        });
    }
    catch (error) {
        return response.json({
            success: false,
            message: error.message,
        })
    }
}

exports.authenticate = async (request, response) => {
    let dataLogin = {
        email: request.body.email,
        password: md5(request.body.password)
    }
    /** check data username and password on user's table */
    let dataUser = await adminModel.findOne({
        where: dataLogin
    })
    /** if data user exists */
    if (dataUser) {
        /** set payload for generate token.
        * payload is must be string.
        * dataUser is object, so we must convert to string.
        */
        let payload = JSON.stringify(dataUser)
        console.log(payload)
        /** generate token */
        let token = jwt.sign(payload, secret)
        /** define response */

        return response.json({
            success: true,
            logged: true,
            message: `Authentication Success`,
            token: token,
            data: dataUser
        })
    }
    /** if data user is not exists */
    return response.json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid username or password`
    })
}

/** create function authroize */
exports.authorize = (request, response, next) => {
    /** get "Authorization" value from request's header */
    const authHeader = request.headers.authorization;
    /** check nullable header */

    if (authHeader) {
        /** when using Bearer Token for authorization,
        * we have to split `headers` to get token key.
        * valus of headers = `Bearers tokenKey`
        */
        const token = authHeader.split(' ')[1];
        /** verify token using jwt */
        let verifiedUser = jwt.verify(token, secret);
        if (!verifiedUser) {
            return response.json({
                success: false,
                auth: false,
                message: `User Unauthorized`
            })
        }
        request.user = verifiedUser; // payload
        /** if there is no problem, go on to controller */
        next();
    } else {
        return response.json({
            success: false,
            auth: false,
            message: `User Unauthorized`
        })
    }
}