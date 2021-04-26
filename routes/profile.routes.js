const express = require('express');
const router  = express.Router();
const User = require('../models/User.model')
const Book = require('../models/Book.model');
const { findByIdAndUpdate } = require('../models/User.model');
const bcrypt = require(`bcrypt`)


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
    res.render('profile', {data:result, layout: layout})
    
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

  /* GET change password */
  router.get(`/edit/password`,(req,res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
      res.render(`edit-password`, {layout:layout}
      )
    })

/* GET render edition of profile */  
router.get(`/edit/:edit`,(req,res) => {
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render(`edit-profile`, {edits:req.params.edit, layout:layout}
    )
  })


/* POST Change password */
router.post(`/edit/password`,checkForAuth,(req,res) => {
  const password = req.body.password
  if (password.length < 8){
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render(`edit-password`, {errorMessage: `La contraseña ha de tener una longitud minima de 8 caracteres`, layout: layout})
  }else {
const hashedPassword = bcrypt.hashSync(password, 10)
User.findByIdAndUpdate(req.user._id, {password: hashedPassword})
.then((result)=>{
res.redirect(`/profile`)
})
.catch((err)=>{
console.log(err)
})
}

})

/* POST Change avatar */
router.post(`/edit/avatar`,checkForAuth,(req,res) => {
  User.findByIdAndUpdate(req.user._id, {avatar:req.body.avatar})
  .then((result)=>{
    res.redirect(`/profile`)
    })
    .catch((err)=>{
    console.log(err)
    })
  })

/* POST Change phrase */
router.post(`/edit/phrase`,checkForAuth,(req,res) => {
  User.findByIdAndUpdate(req.user._id, {phrase:req.body.phrase})
  .then((result)=>{
    res.redirect(`/profile`)
    })
    .catch((err)=>{
    console.log(err)
    })
  })

/* GET remove book from Reading now list */

router.get(`/remove-book-readingNow/:_id`, checkForAuth, (req,res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {readingNow:req.params._id}})
  .then((result)=>{
    console.log(result)
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  })


/* GET remove book from Wishlist */

router.get(`/remove-book-wishlist/:_id`, checkForAuth, (req,res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {wishlist:req.params._id}})
  .then((result)=>{
    console.log(result)
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  })


/* GET remove book from Books finished list */

router.get(`/remove-book-booksFinished/:_id`, checkForAuth, (req,res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {booksFinished:req.params._id}})
  .then((result)=>{
    console.log(result)
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
  })


module.exports = router;