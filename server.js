require('dotenv').config()
var express = require('express');
var compression = require('compression');
var app = express();
var Promise = require("bluebird");
const route = require('./route');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

Promise.config({
    longStackTraces: true,
    warnings: true
})

const model = require('./model');
model.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(compression());
var passport = require('passport');
app.use(passport.initialize());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization, Access-Control-Allow-Headers");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(route)
var http = require('http').Server(app);
http.listen(process.env.APIPort, function() {
    console.log('listening on *:' + process.env.APIPort);
});