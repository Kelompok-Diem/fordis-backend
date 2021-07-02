'use strict';

module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    var postHandlers = require('../controllers/postController.js');

    app.route('/post')
        .post(userHandlers.loginRequired, postHandlers.createPost)
        .get(postHandlers.getAllPosts);
    app.route('/post/:id')
        .get(postHandlers.getPostById);
    app.route('/post/vote/:type/:id')
        .put(userHandlers.loginRequired, postHandlers.vote);
    app.route('/post/share/:id')
        .put(postHandlers.share);
    app.route('/post/deactivate/:id')
        .put(postHandlers.deactivatePost);    
};
