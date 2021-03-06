'use strict';

module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    var postHandlers = require('../controllers/postController.js');
    var imageHandlers = require('../controllers/imageController.js');

    app.route('/post')
        .post(userHandlers.loginRequired, imageHandlers.upload.array('images'), postHandlers.createPost)
        .get(postHandlers.getAllPosts);
    app.route('/post/:id')
        .get(postHandlers.getPostById);
    app.route('/post/vote/:type/:id')
        .put(userHandlers.loginRequired, postHandlers.vote);
    app.route('/post/share/:id')
        .put(postHandlers.share);
    app.route('/post/deactivate/:id')
        .put(postHandlers.deactivatePost);
    app.route('/post/update/:id')
        .put(postHandlers.update);    
    app.route('/post/delete/:id')
        .delete(postHandlers.delete);
};
