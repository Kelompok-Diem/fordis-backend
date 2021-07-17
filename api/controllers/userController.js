'use strict';

var jwt = require('jsonwebtoken'),
  userModel = require('../models/userModel'),
  { ObjectID } = require('mongodb');

exports.register = function (req, res) {
  let db_connect = userModel.connectDb();

  db_connect.insertOne(userModel.createNewUser(req.body), function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      return res.status(200).send({
        message: "User registered successfully"
      });
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

    return res.json({ token: jwt.sign({ email: user.email, full_name: user.full_name, _id: user._id, is_admin: user.is_admin, is_moderator: user.is_moderator}, 'RESTFULAPIs') });
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

exports.update = function (req, res) {
  if (req.user) {
    let db_connect = userModel.connectDb();
    let query = { _id: new ObjectID(req.user._id) };
    let values = {
      $set: userModel.updateuser(req.body)
    };

    db_connect.updateOne(query, values, function (err, user) {
      if (err) {
        res.status(400).send({ message: err })
      }
      return res.status(200).json({ message: 'User Updated' });
    });
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

exports.moderator = async function(req, res){
  if(req.user){
    let db_connect = userModel.connectDb();
    let user = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
    const values = { $set: { is_moderator: true } };
    if(!req.user.is_admin){
      return res.status(400).send({message : "You are not admin"})
    }
    db_connect.updateOne(user,values,function(err, user){
      if (err){
        return req.status(400).send({message: err});
      }

      return res.status(200).send({message:'Now User Is Moderator'})
    });
  }else{
    return res.status(401).send({message: 'Invalid Token'});
  }
}

exports.delete = async function (req, res){
  if (req.user){
    let db_connect = userModel.connectDb();

    if (!req.user.is_admin && !req.user.is_moderator) {
      return res.status(400).send({ message: "Not authorized" });
    }
    const query = { _id: new ObjectID(req.params.id) };
    db_connect.deleteOne(query,function (err, post){
      if (err) {
        return res.status(400).send({ message: err });
      }

    return res.status(200).send({ message: 'User Deleted' })
    });
  }else {
    return res.status(401).send({ message: 'Invalid token' });
  }
}

exports.getUser = function (req, res){
  let db_connect = userModel.connectDb();

  db_connect.findOne({ _id: new ObjectID(req.params.id) }, function (err, profile) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    }

    delete profile.hash_password;

    if (req.user) {
      profile.user = {
        is_owner: profile._id == req.user._id,
        is_moderator: req.user.is_moderator,
        is_admin: req.user.is_admin,
      }
    }

    return res.status(200).send(profile);
  })
}
