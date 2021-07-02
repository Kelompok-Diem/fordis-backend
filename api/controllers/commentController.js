'use strict';

const { ObjectID } = require('mongodb');
var commentModel = require('../models/commentModel');

exports.createComment = function (req, res) {
  if (req.user) {
    let db_connect = commentModel.connectDb();
    let newComment = commentModel.createNewComment(req.body, req.user);

    db_connect.insertOne(newComment, function (err, comment) {
      if (err) {
        return res.status(400).send({
          message: err
        })
      }

      return res.status(200).send({
        message: "Comment created successfully"
      });
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

exports.getCommentsByPostId = function(req, res) {
  let db_connect = commentModel.connectDb();

  db_connect.find({ post_id: new ObjectID(req.params.post_id) }).toArray(function(err, comments) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    }

    return res.status(200).send(comments);
  })
}

exports.update = async function (req, res) {
  if (req.user) {
    let db_connect = commentModel.connectDb();

    let comment = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
    const comment_user_id = String(comment.user_id);
    const user_id = String(req.user._id)
    if (comment_user_id !== user_id) {
      return res.status(400).send({ message: "Not authorized" });
    }

    const query = { _id: new ObjectID(req.params.id) };
    const new_values = { $set: commentModel.updateComment(req.body)};

    db_connect.updateOne(query, new_values, function (err, comment) {
      if (err) {
        return res.status(400).send({ message: err });
      }

      return res.status(200).send({ message: 'Comment Update' })
    });
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }
}