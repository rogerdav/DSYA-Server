'use strict';

const bodyParser = require('body-parser').json();
const ErrorHandler = require('../lib/error-handler');
const User = require('../model/team1User');


module.exports = router => {

  router.post('/team1/createuser/', bodyParser, (req, res) => {
    let user = new User(req.body);
    return user.save()
      .then(user => {
        console.log('user created', user);
        res.status(201).json(user);
      })
      .catch(err => {
        ErrorHandler(err, res);
      });
  });

  
  
  
  
  

  

};