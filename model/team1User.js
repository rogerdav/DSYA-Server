'use strict';

const mongoose = require('mongoose');

const teamOneUser = mongoose.Schema ({
  name: {type: String},
  email: {type: String},
  username: {type: String},
  password: {type: String},
  secretquestion: {type: String},
  secretanswer: {type: String},

}, {timestamps: true});

module.exports = mongoose.model('teamoneuser', teamOneUser);