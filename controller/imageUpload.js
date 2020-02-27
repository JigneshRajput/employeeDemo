var multer = require('multer');
var upload = multer();
var path = require('path')
var fs = require('fs');
const commonFunction = require('../Utils/common');
// SET STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './controller/EmployeeImage')
    },
    limits: {
        files: 1,
        fileSize: 1024 * 1024
    },
    filename: function(req, file, cb) {
        cb(null, commonFunction.GetUserNameFromDate() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback("Please select only image file");
        }
        callback(null, true)

    },
    limits: {
        fileSize: 1024 * 1024
    }
});

module.exports = upload