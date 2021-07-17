'use strict';

const { ObjectID } = require('mongodb');
const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');

exports.createComment = function (req, res) {
  if (req.user) {
    let db_connect = commentModel.connectDb();
    let newComment = commentModel.createNewComment(req.body, req.user, req.files);

    db_connect.insertOne(newComment, function (err, comment) {
      if (err) {
        return res.status(400).send({
          message: err
        })
      }

      const post_db_connect = postModel.connectDb();
      const query = { _id: new ObjectID(req.body.post_id) };
      const new_values = { $inc: { comment_count: 1 } };

      post_db_connect.updateOne(query, new_values, function (err, post) {
        if (err) {
          return res.status(400).send({ message: err });
        }
      });

      return res.status(200).send({
        message: "Comment created successfully"
      });
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

exports.getCommentsByPostId = async function(req, res) {
  let db_connect = commentModel.connectDb();

  db_connect.find({ post_id: new ObjectID(req.params.post_id) }).toArray(async function(err, comments) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    }

    comments = await Promise.all(comments.map(async (comment) => {
      const user_db_connect = userModel.connectDb();
      const author = await user_db_connect.findOne({ _id: new ObjectID(comment.user_id) });

      comment.author = author.full_name;

      if (req.user) {
        comment.user = userModel.getUserInComment(req.user, comment)
      }

      return comment;
    }));

    return res.status(200).send(comments);
  })
}

exports.vote = async function (req, res) {
  if (req.user) {
    try {
      let db_connect = commentModel.connectDb();

      let comment = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

      const type = parseInt(req.params.type);

      const target = (type === 1 ? "up" : "down") + "votes";
      const source = (type === 1 ? "down" : "up") + "votes";

      if (comment[target].find((user_id) => { return user_id === req.user._id })) {
        comment[target] = comment[target].filter((user_id) => {
          return (user_id !== req.user._id);
        })

        comment.votes -= type;
      } else {
        if (comment[source].find((user_id) => { return user_id === req.user._id })) {
          comment[source] = comment[source].filter((user_id) => {
            return (user_id !== req.user._id);
          })
          comment.votes += type;
        }

        comment[target].push(req.user._id);
        comment.votes += type;
      }

      const query = { _id: new ObjectID(req.params.id) };
      const new_values = { $set: comment };

      db_connect.updateOne(query, new_values, function (err, comment) {
        if (err) {
          return res.status(400).send({ message: err });
        }

        return res.status(200).send({ message: 'Vote submitted' })
      })
    } catch (err) {
      return res.status(400).send({ message: err })
    }
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }
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

exports.delete = async function (req, res){
  if (req.user){
    let db_connect = commentModel.connectDb();

    let comment = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
    let user = toString(req.user._id)
    let commenttuser = toString(comment.user_id)
    if ( user !== commenttuser && !req.user.is_admin && !req.user.is_moderator) {
      return res.status(400).send({ message: "Not authorized" });
    }

    const query = { _id: new ObjectID(req.params.id) };
    db_connect.deleteOne(query,function (err, response){
      if (err) {
        return res.status(400).send({ message: err });
      }

      const post_db_connect = postModel.connectDb();
      const query = { _id: new ObjectID(comment.post_id) };
      const new_values = { $inc: { comment_count: -1 } };

      post_db_connect.updateOne(query, new_values, function (err, post) {
        if (err) {
          return res.status(400).send({ message: err });
        }
      });

      return res.status(200).send({ message: 'Comment Deleted' })
    });
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }
}
