'use strict';

var postModel = require('../models/postModel');

exports.createPost = function(req, res) {
  if (req.user) {
    let db_connect = postModel.connectDb();

    var newPost = postModel.createNewPost(req.body, req.user);

    db_connect.insertOne(newPost, function(err, post) {
      if (err) {
        return res.status(400).send({
          message:err
        })
      } else {
        return res.status(200).send({
          message: "Post created successfully"
        });
      }
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

exports.getAllPosts = function(req, res) {
  let db_connect = postModel.connectDb();

  db_connect.find({ is_active: true }).toArray(function(err, post) {
    if (err) {
      return res.status(400).send({
        message:err
      })
    } else {
      return res.status(200).send(post);
    }
  })
}
