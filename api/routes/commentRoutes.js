'use strict';

module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    var commentHandlers = require('../controllers/commentController.js');

    app.route('/comment')
        .post(userHandlers.loginRequired, commentHandlers.createComment);
    app.route('/comment/:post_id')
        .get(commentHandlers.getCommentsByPostId);
};
