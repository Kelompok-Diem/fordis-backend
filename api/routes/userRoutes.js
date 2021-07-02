'use strict';

module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');

    app.route('/profile')
        .get(userHandlers.loginRequired, userHandlers.profile);
    app.route('/auth/register')
        .post(userHandlers.register);
    app.route('/auth/login')
        .post(userHandlers.login);
    app.route('/auth/update')
        .put(userHandlers.loginRequired, userHandlers.update);
};
