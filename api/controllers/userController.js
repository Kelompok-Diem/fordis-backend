'use strict';

var jwt = require('jsonwebtoken'),
  userModel = require('../models/userModel');

exports.register = function (req, res) {
  let db_connect = userModel.connectDb();

  db_connect.insertOne(userModel.createNewUser(req.body), function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      let result = user.ops[0];

      delete result.hash_password;

      return res.json(result);
    }
  });
};

exports.login = function (req, res) {
  let db_connect = userModel.connectDb();

  db_connect.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      throw err;
    }

    if (!user || !userModel.comparePassword(req.body.password, user.hash_password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }

    return res.json({ token: jwt.sign({ email: user.email, full_name: user.full_name, _id: user._id }, 'RESTFULAPIs') });
  });
};

exports.loginRequired = function (req, res, next) {
  if (req.user) {
    next();
  } else {

    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};

exports.profile = function (req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
