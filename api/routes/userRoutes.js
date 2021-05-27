'use strict';
module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    // todoList Routes
    app.route('/api/profile')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/api/auth/register')
        .post(userHandlers.register);
    app.route('/api/auth/sign_in')
        .post(userHandlers.sign_in);
};
