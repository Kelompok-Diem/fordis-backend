'use strict';
module.exports = function (app) {
    var userHandlers = require('../controllers/userController.js');
    var postHandlers = require('../controllers/postController.js');
    // todoList Routes
    app.route('/post')
        .post(userHandlers.loginRequired, postHandlers.createPost)
        .get(postHandlers.getAllPosts)
};
