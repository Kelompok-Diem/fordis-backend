'use strict';

// get environment variable from .env file
require('dotenv').config();

// intialize
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,

  User = require('./api/models/userModel.js'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken");

// connect to MongoDB Atlas
const mongoose = require('mongoose');
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  useNewUrlParser: true
};

const mongoURI = process.env.MONGODB_URI;
console.log(mongoURI);
mongoose.connect(mongoURI, option).then(function () {
  console.log("Masuk");
}, function (err) {
  console.log(err);
});


// connect to routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

var routes = require('./api/routes/userRoutes.js');
routes(app);

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
