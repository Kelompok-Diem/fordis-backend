'use strict';

// get environment variable from .env file
require('dotenv').config();

// intialize
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,

  User = require('./api/models/userModel.js'),
  Post = require('./api/models/postModel.js'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken"),
  cors = require('cors');

app.use(cors());

// connect to MongoDB Atlas
const mongoose = require('mongoose');
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  useNewUrlParser: true
};

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, option).then(function () {
  console.log("Connected to MongoDB");
}, function (err) {
  console.log(err);
});


// connect to routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

// var userRoutes = require('./api/routes/userRoutes.js');
// routes(app);

require('./api/routes/userRoutes.js')(app);
require('./api/routes/postRoutes.js')(app);

app.get('/api', (req, res) => {
  res.send('Hello World!');
})

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

// start server
app.listen(port);

console.log('RESTful API server started on: ' + port);

module.exports = app;
