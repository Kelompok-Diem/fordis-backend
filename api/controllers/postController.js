'use strict';

var postModel = require('../models/postModel'),
  { ObjectID } = require('mongodb');

exports.createPost = function (req, res) {
  if (req.user) {
    let db_connect = postModel.connectDb();

    var newPost = postModel.createNewPost(req.body, req.user);

    db_connect.insertOne(newPost, function (err, post) {
      if (err) {
        return res.status(400).send({
          message: err
        })
      } else {
        return res.status(200).send({
          message: "Post created successfully"
        });
      }
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
    // ubah kaya register
  }
}

exports.getAllPosts = function (req, res) {
  let db_connect = postModel.connectDb();

  db_connect.find({}).sort({ date_created: -1 }).toArray(function (err, post) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    } else {
      return res.status(200).send(post);
    }
  })
}

exports.getPostById = function (req, res) {
  let db_connect = postModel.connectDb();

  db_connect.findOne({ _id: new ObjectID(req.params.id) }, function (err, post) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    }

    return res.status(200).send(post);
  })
}

exports.vote = async function (req, res) {
  if (req.user) {
    try {
      let db_connect = postModel.connectDb();

      let post = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

      const type = parseInt(req.params.type);

      const target = (type === 1 ? "up" : "down") + "votes";
      const source = (type === 1 ? "down" : "up") + "votes";

      if (post[target].find((user_id) => { return user_id === req.user._id })) {
        post[target] = post[target].filter((user_id) => {
          return (user_id !== req.user._id);
        })
        post.votes -= type;
      } else {
        if (post[source].find((user_id) => { return user_id === req.user._id })) {
          post[source] = post[source].filter((user_id) => {
            return (user_id !== req.user._id);
          })
          post.votes += type;
        }

        post[target].push(req.user._id);
        post.votes += type;
      }

      const query = { _id: new ObjectID(req.params.id) };
      const new_values = { $set: post };

      db_connect.updateOne(query, new_values, function (err, post) {
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

exports.share = function (req, res) {
  let db_connect = postModel.connectDb();
  const query = { _id: new ObjectID(req.params.id) };
  const new_values = { $inc: { share_count: 1 } };

  db_connect.updateOne(query, new_values, function (err, post) {
    if (err) {
      return res.status(400).send({ message: err });
    }

    return res.status(200).send({ message: 'Share incremented' })
  });
}

exports.deactivatePost = async function (req, res) {
  if (req.user) {
    let db_connect = postModel.connectDb();

    let post = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
    if (post.user_id !== req.user._id) {
      return res.status(400).send({ message: "Not authorized" });
    }

    const query = { _id: new ObjectID(req.params.id) };
    const new_values = { $set: { is_active: false } };

    db_connect.updateOne(query, new_values, function (err, post) {
      if (err) {
        return res.status(400).send({ message: err });
      }

      return res.status(200).send({ message: 'Post deactivated' })
    });
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }
}

exports.update = async function (req, res) {
  if (req.user) {
    let db_connect = postModel.connectDb();

    let post = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
    if (post.user_id !== req.user._id) {
      return res.status(400).send({ message: "Not authorized" });
    }

    const query = { _id: new ObjectID(req.params.id) };
    const new_values = { $set: postModel.updatepost(req.body)};

    db_connect.updateOne(query, new_values, function (err, post) {
      if (err) {
        return res.status(400).send({ message: err });
      }

      return res.status(200).send({ message: 'Post Update' })
    });
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }
}
