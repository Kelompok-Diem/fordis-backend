'use strict';

var dbo = require('../../db/conn');

module.exports = {
  createNewPost: function(post, user) {
    const newPost = {
      title: post.title,
      content: post.content,
      user_id: user._id,
      date_created: new Date(),
      is_active: true
    }

    return newPost;
  },

  connectDb: function() {
    let db = dbo.getDb();

    if (db === undefined) {
      return null;
    }

    return db.collection('posts');
  }
}
