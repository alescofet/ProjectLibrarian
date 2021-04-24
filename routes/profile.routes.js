const express = require('express');
const router  = express.Router();
const User = require('../models/User.model')
const Book = require('../models/Book.model');


//Middleware de checkForAuth
const checkForAuth = (req,res,next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}
/* GET profile page */
router.get('/', checkForAuth ,(req, res) => {
  User.findById(req.user._id)
  .populate(`booksFinished`)
  .populate(`readingNow`)
  .populate(`wishlist`)
  .then((result) => {
    console.log(result);
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('profile', {data:result, layout })
    
  })
  .catch((err) => {
    console.log(err); 
  });
})

/* POST push book finished books array */
router.post(`/finished-books`, checkForAuth, (req,res) => {
User.findByIdAndUpdate(req.user._id, {$push: {booksFinished:req.body}})
.then((result)=>{
  res.redirect('/profile')
})
.catch((error)=>{
  res.send(error)
})
})

/* POST push book reading now array */
router.post(`/readingNow-books`, checkForAuth, (req,res) => {
User.findByIdAndUpdate(req.user._id, {$push: {readingNow:req.body}})
.then((result)=>{
  res.redirect('/profile')
})
.catch((error)=>{
  res.send(error)
})
})

/* POST push book wishlist array */
router.post(`/wishlist`, checkForAuth, (req,res) => {
  User.findByIdAndUpdate(req.user._id, {$push: {wishlist:req.body}})
  .then((result)=>{
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  })


module.exports = router;