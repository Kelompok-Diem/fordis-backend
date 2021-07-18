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

exports.getAll = function (req, res) {
    let db_connect = repportModel.connectDb();
  
    db_connect.find({}).toArray(function (err, repport) {
      if (err) {
        return res.status(400).send({
          message: err
        })
      } else {
        return res.status(200).send(repport);
      }
    })
}

exports.delete = async function (req, res) {
    console.log(req.user)
    if (req.user) {
      let db_connect = repportModel.connectDb();
  
      let report = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
      if (!req.user.is_admin && !req.user.is_moderator) {
        return res.status(400).send({ message: "Not authorized" });
      }
  
      const query = { _id: new ObjectID(req.params.id) };
      db_connect.deleteOne(query, function (err, report) {
        if (err) {
          return res.status(400).send({ message: err });
        }
  
        return res.status(200).send({ message: 'report Deleted' })
      });
    } else {
      return res.status(401).send({ message: 'Invalid token' });
    }
  }