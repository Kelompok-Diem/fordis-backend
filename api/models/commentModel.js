'use strict';

var dbo = require('../../db/conn'),
  { ObjectID } = require('mongodb');

module.exports = {
  createNewComment: function(comment, user, images) {
    const newComment = {
      content: comment.content,
      user_id: new ObjectID(user._id),
      post_id: new ObjectID(comment.post_id),
      date_created: new Date(),
      images: images.map((value) => {
        return (value.filename)
      })
    }

    return newComment;
  },

  updateComment: function(comment){
    return{content: comment.content}
  },

  connectDb: function() {
    let db = dbo.getDb();

    if (db === undefined) {
      return null;
    }

    return db.collection('comments');
  }
}
