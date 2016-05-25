var express = require('express');
var router = express.Router()
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var auth = jwt({secret: 'myLittleSecret'});
var passport = require('passport');

require('../config/passport');

var Post = require('../models/Posts');
var Comment = require('../models/Comments');
var User = require('../models/Users');



router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});



router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);

  console.log(req.user);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
}); 

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});
 

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote();


  req.post.save(function(err, post) {
    res.json(post);
  });
});


router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote();

  req.comment.save(function(err, comment) {
    res.json(comment);
  });
});


//USERS..
 // setting up the server side to get all the users back into the client side.. connects with services
//services on client side connects with the server.
//everything starts from client side bc thats where the requests are coming from,

//get req in the server to database to get all the users, its invoked by a function in the friends.js
router.get('/users', function(req, res, next){  //specify the route, u can name it whatever u want but it has to match the route in friends.js
  User.find(function(err, users){
    if(err){return next(err);}
    res.json(users);
  });
});


//putting current user into thr friends array and vice versa
//:user and :friend is "replaced" with the actual id that are in database in collections, 

router.put('/users/:user/friends/:friend', function(req, res, next){
  console.log(req.params);  //gives u an object back with both parameters, user and friend and then u spcify which one u want
  User.findById(req.params.user, function(err, user){ //goes thru all the users, req.params.user is the id. the user as param is the user we found by id
    user.friends.push(req.params.friend);  // pushing the friend id into the user friends array
    user.save(function (err, user) {  //save the updated info
      // res.json(user);
    });
  });

  User.findById(req.params.friend, function(err, user){
    user.friends.push(req.params.user);
    user.save(function(err, user){
      // res.json(friend);
    })
  })
  res.end();  
});


//get a piece of something///params
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

module.exports = router;