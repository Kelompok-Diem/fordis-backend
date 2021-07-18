'use strict';

var dbo = require('../../db/conn');

module.exports = {
    createNewRepport: function(user_repport, user, repport) {
        const newRepport = {
          jenis_repport: user_repport.jenis_repport,
          user_id: user._id,
          yang_di_repport: repport,
        }
    
        return newRepport;
      },
    connectDb: function() {
    let db = dbo.getDb();

    if (db === undefined) {
      return null;
    }

    return db.collection('repport');
  }
}
