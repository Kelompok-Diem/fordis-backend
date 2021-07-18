'use strict';

module.exports = function (app) {
    var repportHandlers = require('../controllers/repportController.js');

    app.route('/report/user/:id')
        .post(repportHandlers.user);
    app.route('/report/post/:id')
        .post(repportHandlers.post);
    app.route('/report/comment/:id')
        .post(repportHandlers.comment);
    app.route('/report')
        .get(repportHandlers.getAll)
    app.route('/report/delete/:id')
        .delete(repportHandlers.delete)
};
