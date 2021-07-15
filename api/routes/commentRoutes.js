'use strict';

module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    var commentHandlers = require('../controllers/commentController.js');
    var imageHandlers = require('../controllers/imageController.js');

    app.route('/comment')
        .post(
            userHandlers.loginRequired,
            imageHandlers.upload.array('images'),
            commentHandlers.createComment
        );
    app.route('/comment/:post_id')
        .get(commentHandlers.getCommentsByPostId);
    app.route('/comment/update/:id')
        .put(commentHandlers.update); 
    app.route('/comment/delete/:id')
        .delete(commentHandlers.delete);
};
