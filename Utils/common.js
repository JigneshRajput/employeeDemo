//node modules
var models = require('../model');
var fs = require('fs');
const jwt = require('jsonwebtoken');
const objMessage = require('./message');
const Employee = models.employeetbl;
var sequelize = models.sequelize;
//models
const salt = 10

function getToken(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

const JwtSign = (payload) => {
    console.log('payload :', payload);
    if (payload) {
        const token = jwt.sign(payload, process.env.SecretKey, { expiresIn: '30d' });
        return token
    }
}

const JwtDecode = (token) => {
    console.log('headers :', token);
    if (token) {
        var user = jwt.decode(token, process.env.SecretKey);
        return user
    } else {
        return objMessage.InvalidToken;
    }




    // if (token) {
    //     // return new Promise((resolve, reject) => {

    //     // })
    //     const verify = jwt.verify(token, process.env.PublicKey)
    //     if (verify) {
    //         var user = jwt.decode(token, process.env.SecretKey);
    //         console.log('typeof user  :', user);
    //         if (user) {
    //             console.log('token :', token);
    //             return user
    //         }
    //     } else {
    //         return false
    //     }
    // }
}

function GetUserNameFromDate() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();

    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    var milisec = d.getMilliseconds();

    return curr_year.toString() + curr_month.toString() + curr_date.toString() + hour.toString() + minutes.toString() + seconds.toString() + milisec.toString();
}

const checkTokenStatus = async(token) => {
    if (token) {
        const checkStatus = await Employee.findOne({ where: { token: token } })
        if (checkStatus) {
            const user = JwtDecode(token);
            return user
        } else {
            const message = objMessage.NoAccessPermission
            return message;
        }
    }
}

module.exports = {
    Salt: salt,
    Sign: JwtSign,
    Decode: JwtDecode,
    TokenStatus: checkTokenStatus,
    GetUserNameFromDate: GetUserNameFromDate
};