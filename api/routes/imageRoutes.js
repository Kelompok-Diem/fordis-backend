'use strict';

module.exports = function (app) {
    var imageHandlers = require('../controllers/imageController.js');

    app.route('/images/:filename')
        .get(imageHandlers.getImage);
};
