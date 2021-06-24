'use strict';

var bcrypt = require('bcrypt'),
  dbo = require('../../db/conn');

module.exports = {
  createNewUser: function(user) {
    let newUser = user;
    newUser.hash_password = bcrypt.hashSync(user.password, 10);

    delete newUser.password;

    return newUser;
  },

  updateuser : function(user){
    return {
      full_name: user.full_name
    } 
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
