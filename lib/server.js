'use strict';

// Application Dependencies
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./error-handler');
const chalk = require('chalk');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const router = express.Router();
const MONGODB_URI = process.env.MONGODB_URI;

//Middleware
app.use(cors());
app.use( router);
//TODO:verify that route names are the same and correct paths
require('../route/team1Route')(router);
require('../route/team2Route')(router);
require('../route/team3Route')(router);

app.all('/{0,}', (req,res) => errorHandler(new Error('Path Error, Route not found'), res));

//Server Controls
const server = module.exports = {};
server.isOn = false;
server.start = () => {
  return new Promise((resolve, reject) => {
    if(server.isOn) return reject(new Error('Server Running. Cannot start server on same port'));
    return server.http = app.listen(PORT, () => {
      console.log(chalk.red(`listening on ${PORT}`));
      server.isOn = true;
      mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      return resolve(server);
    });
  });
};

server.stop = () => {
  
  return new Promise((resolve, reject) => {

    if(!server.isOn) return reject(new Error('Server Error. Cannot stop server that is not running.'));
    return server.http.close(() => {
      console.log('this is inside server stop');
      server.isOn = false;
      mongoose.disconnect();
      return resolve(server);
    });
  });
};