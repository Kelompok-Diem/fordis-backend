'use strict';

module.exports = function (app) {
    var repportHandlers = require('../controllers/repportController.js');

    app.route('/report/:type/:id')
        .post(repportHandlers.createReport);
    app.route('/report')
        .get(repportHandlers.getAll)
    app.route('/report/delete/:id')
        .delete(repportHandlers.delete)
};
