'use strict';

const bodyParser = require('body-parser').json();
const ErrorHandler = require('../lib/error-handler');
const User = require('../model/team2User');
const basicAuthMiddleware = require('../lib/basic-auth-middleware');
const errorHandler = require('../lib/error-handler');
const sendEmail = require('../lib/sendResetEmail');


module.exports = router => {

  router.post('/team2/createuser/', bodyParser, async (req, res) => {
    let found = await User.find({ 
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    })
    console.log('found', found);
    if(found.length === 0) {
      let user = new User(req.body);
      return user.save()
        .then(user => {
          console.log('user created', user);
          res.status(201).json(user);
        })
        .catch(err => {
          ErrorHandler(err, res);
        });

    } else {
      res.status(400).json('Username or email already exists');
    }
  });
  router.get('/team2/checkusername/:username', bodyParser, (req, res) => {
    console.log('request params', req.params.username);
    User.find({username: req.params.username})
      .then(result => {
        console.log('result from search', result);
        if (result.length === 0) {
          res.status(200).json('not found');
        } 
        if (result.length > 0) {

          res.status(200).json('user exists');
        }
      })
      .catch(err => errorHandler(err, res));
  });

  router.get('/team2/login/', bodyParser, basicAuthMiddleware, (req, res) => {
    
    console.log('request user info', req.userModelHeader);
    User.find({username: req.userModelHeader.username})
      .then(result => {
        console.log('result', result);
        if (result.length === 0) {
          res.status(400).json('User name not found');
        }
        if (result) {
          if(result[0].password === req.userModelHeader.password) {
            res.status(201).json('username and password ok');
          } else {
            res.status(201).json('Password incorrect');
          }
          
        }
      })
      .catch(err => console.log(err));
  });

  router.put('/team2/resetemail/', bodyParser, (req, res) => {
    
    
    User.find({username: req.body.username})
      .then(async result => {
        if(result.length > 0){
          let emailResponse = await sendEmail(result[0].email, req.body.link)
          if (emailResponse) {
            res.sendStatus(204);
          } else {
            throw new Error('no file')
          }
          
        } else {
          throw new Error('no file')
        }
      })
      .catch(err => errorHandler(err, res));
  });
  
  
  
  

  

};