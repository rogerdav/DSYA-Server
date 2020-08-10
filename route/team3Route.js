'use strict';

const bodyParser = require('body-parser').json();
const ErrorHandler = require('../lib/error-handler');
const User = require('../model/team3User');
const basicAuthMiddleware = require('../lib/basic-auth-middleware');


module.exports = router => {

  router.post('/team3/createuser/', bodyParser, async (req, res) => {
    // let foundUsername = await User.find({ 
    //   $or: [
    //     { username: req.body.username },
    //     { email: req.body.email }
    //   ]
    // })
    let foundUsername = await User.find({username: req.body.username})
    let foundEmail = await User.find({email: req.body.email})
    if(foundEmail.length > 0 && foundUsername.length > 0) {
      res.status(400).json('Email and username already in use');
    }
    if(foundEmail.length > 0) {
      res.status(400).json('Email already in use');
    }
    if(foundUsername.length > 0) {
      res.status(400).json('Username already in use');
    }

    // console.log('found', found);
    if(foundUsername.length === 0 && foundEmail.length === 0) {
      let user = new User(req.body);
      return user.save()
        .then(user => {
          console.log('user created', user);
          res.status(201).json(user);
        })
        .catch(err => {
          ErrorHandler(err, res);
        });

    } 
    
  });

  router.get('/team3/checkusername/:username', bodyParser, (req, res) => {
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

  router.get('/team3/checkemail/:email', bodyParser, (req, res) => {
    console.log('request params', req.params.username);
    User.find({email: req.params.email})
    .then(result => {
      console.log('result from search', result);
      if (result.length === 0) {
        res.status(200).json('not found');
      } 
      if (result.length > 0) {

        res.status(200).json('email already in use');
      }
    })
    .catch(err => errorHandler(err, res));
  });

  router.get('/team3/login/', bodyParser, basicAuthMiddleware, (req, res) => {
    
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
  router.get('/team3/secretquestion/:username', bodyParser, (req, res) => {
    User.find({username: req.params.username})
      .then(result => {
       let user = result[0];
       res.status(201).json(user.secretquestion)
      })
      .catch(err => console.log(err));
  });

  router.put('/team3/checkanswer/', bodyParser, (req, res) => {
    User.findOne({username: req.body.username})
      .then(user => {
        if(user.secretanswer === req.body.answer)  {
          res.status(200).json(user._id);
        } else {
          res.status(200).json('Incorrect Answer');
        }
      })
      .catch(err => errorHandler(err, res));
  });

  router.put('/team3/changepassword/', bodyParser, (req, res) => {
    User.findOne({_id: req.body.id})
      .then(user => {
       user.password = req.body.password;
       return user.save();
      })
      .then(userSaved => {
        res.sendStatus(204)
      })
      .catch(err => errorHandler(err, res));
  });
  };
  
  