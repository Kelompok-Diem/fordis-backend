'use strict';

var bcrypt = require('bcrypt'),
  dbo = require('../../db/conn');

module.exports = {
  createNewUser: function(user) {
    const newUser = {
      full_name: user.full_name,
      email: user.email,
      hash_password: bcrypt.hashSync(user.password, 10),
      is_admin: false,
      is_moderator: false,
    }

    return newUser;
  },

  updateuser : function(user){
    return {
      full_name: user.full_name
    }
  },

  getUserInPost: function(user, post) {
    const result = {
      is_author: user._id === post.user_id,
      is_admin: user.is_admin ? true: false,
      is_moderator: user.is_moderator ? true : false,
      upvoted: post.upvotes.includes(user._id),
      downvoted: post.downvotes.includes(user._id),
    }

    return result;
  },

  comparePassword: function(password, hash_password) {
    return bcrypt.compareSync(password, hash_password);
  },

  connectDb: function() {
    let db = dbo.getDb();
    if (db === undefined) {
      return null;
    }

    return db.collection('users');
  }
}
