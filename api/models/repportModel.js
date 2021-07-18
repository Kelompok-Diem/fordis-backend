'use strict';

var dbo = require('../../db/conn');

module.exports = {
  createNewRepport: function (report, user, target) {
    const newRepport = {
      reason: report.reason,
      reporter_id: user._id,
      [target.type + "_id"]: target.id,
    }

    return newRepport;
  },

  connectDb: function () {
    let db = dbo.getDb();

    if (db === undefined) {
      return null;
    }

    return db.collection('repport');
  }
}
