'use strict';

var mongoose = require('mongoose'),
  Post = mongoose.model('Post');

exports.createPost = function(req, res) {
  if (req.user) {
    var newPost = new Post(req.body);
    newPost.user_id = req.user._id;

    newPost.save(function(err, post) {
      if (err) {
        return res.status(400).send({
          message:err
        })
      } else {
        return res.json(post);
      }
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

exports.getAllPosts = function(req, res) {
  Post.find({}, function(err, post) {
    if (err) {
      return res.status(400).send({
        message:err
      })
    } else {
      return res.json(post);
    }
  })
}
