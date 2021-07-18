'use strict';

// get environment variable from .env file
require('dotenv').config();

// intialize
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,

  jsonwebtoken = require("jsonwebtoken"),
  cors = require('cors');

app.use(cors());

// connect to MongoDB Atlas
const dbo = require("./db/conn");

dbo.connectToServer(function (err) {
  if (err) console.error(err);
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

require('./api/routes/userRoutes.js')(app);
require('./api/routes/postRoutes.js')(app);
require('./api/routes/commentRoutes.js')(app);
require('./api/routes/imageRoutes.js')(app);
require('./api/routes/repportRoutes.js')(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

// start server
app.listen(port);

console.log('RESTful API server started on: ' + port);

module.exports = app;
