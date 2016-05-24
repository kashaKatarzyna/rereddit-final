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


//USERS

router.get('/users', function(req, res, next){
  User.find(function(err, users){
    if(err){return next(err);}
    res.json(users);
  });
});


//putting current user into thr friends array and vice versa
router.put('/users/:user/friends/:friend', function(req, res, next){
  
  User.findById(req.params.user, function(err, user){
    user.friends.push(req.params.friend);
    user.save(function (err, user) {
      res.json(user);
    });
  });
});

router.put('/friends/:friend/users/:user', function(req, res, next){
  User.findById(req.params.user, function(err, user){
    friend.user.push(req.params.friend);
    friend.save(function(err, user){
      res.json(friend);
    });
  });
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

// router.param('user', function(req, res, next, id){
//   var query = User.findById(id);

//   query.exec(function (err, user){
//     if (err) { return next(err); }
//     if (!user) { return next(new Error('can\'t find user')); }

//     req.user = user;
//     return next();
//   });
// });

module.exports = router;