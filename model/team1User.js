'use strict';

const mongoose = require('mongoose');

const teamOneUser = mongoose.Schema ({
  name: {type: String},
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String},
  secretquestion: {type: String},
  secretanswer: {type: String},

}, {timestamps: true});

module.exports = mongoose.model('teamoneuser', teamOneUser);