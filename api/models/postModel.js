'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Schema.Types.ObjectId;

var PostSchema = new Schema({
  user_id: {
    type: ObjectId,
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  date_created: {
    type: Date,
    default: Date.now
  },
})

mongoose.model('Post', PostSchema);
