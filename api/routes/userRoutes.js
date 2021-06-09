'use strict';

// var userHandlers = require('../controllers/userController.js'),
//     router = require('express').Router()
var path = process.cwd();

module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    // todoList Routes
    app.route('/profile')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/auth/register')
        .post(userHandlers.register);
    app.route('/auth/login')
        .post(userHandlers.login);
};
