'use strict';

var repportModel = require('../models/repportModel'),
  { ObjectID } = require('mongodb');

exports.user = function (req, res) {
  if (req.user) {
    let db_connect = repportModel.connectDb();

    var newRepport = repportModel.createNewRepport(req.body, req.user, req.params.id);

    db_connect.insertOne(newRepport, function (err, repport) {
      if (err) {
        return res.status(400).send({
          message: err
        })
      } else {
        return res.status(200).send({
          message: "repport created successfully"
        });
      }
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

exports.post = function (req, res) {
    if (req.user) {
      let db_connect = repportModel.connectDb();
  
      var newRepport = repportModel.createNewRepport(req.body, req.user, req.params.id);
  
      db_connect.insertOne(newRepport, function (err, repport) {
        if (err) {
          return res.status(400).send({
            message: err
          })
        } else {
          return res.status(200).send({
            message: "repport created successfully"
          });
        }
      })
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
}

exports.comment = function (req, res) {
    if (req.user) {
      let db_connect = repportModel.connectDb();
  
      var newRepport = repportModel.createNewRepport(req.body, req.user, req.params.id);
  
      db_connect.insertOne(newRepport, function (err, repport) {
        if (err) {
          return res.status(400).send({
            message: err
          })
        } else {
          return res.status(200).send({
            message: "repport created successfully"
          });
        }
      })
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
