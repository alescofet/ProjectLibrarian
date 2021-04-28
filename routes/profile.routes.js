const express = require('express');
const router  = express.Router();
const User = require('../models/User.model')
const Book = require('../models/Book.model');
const bcrypt = require(`bcrypt`)
let admin = false


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
  admin=false
  User.findById(req.user._id)
  .populate(`booksFinished`)
  .populate(`readingNow`)
  .populate(`wishlist`)
  .then((result) => {
    if (req.user.role=="Admin"){admin=true}
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('profile', {data:result,admin, layout: layout})
  })
  .catch((err) => {
    console.log(err); 
  });
})

/* POST push book finished books array */
router.post(`/finished-books`, checkForAuth, (req,res) => {
if (req.user.readingNow.includes(req.body._id)){
  User.findByIdAndUpdate(req.user._id, {$pull: {readingNow:req.body._id}})
  .then((result) => {
    User.findByIdAndUpdate(req.user._id, {$push: {booksFinished:req.body}})
    .then((result)=>{
    res.redirect('/profile')
    })
  })
  .catch((err) => {
    console.log(err);
  });
  }
if (req.user.wishlist.includes(req.body._id)){
  User.findByIdAndUpdate(req.user._id, {$pull: {wishlist:req.body._id}})
  .then((result) => {
    User.findByIdAndUpdate(req.user._id, {$push: {booksFinished:req.body}})
    .then((result)=>{
    res.redirect('/profile')
    })
  })
  .catch((err) => {
    console.log(err);
  });
  }
if (req.user.booksFinished.includes(req.body._id)){
  User.findByIdAndUpdate(req.user._id, {$pull: {booksFinished:req.body._id}})
  .then((result) => {
    User.findByIdAndUpdate(req.user._id, {$push: {booksFinished:req.body}})
    .then((result)=>{
    res.redirect('/profile')
    })
  })
  .catch((err) => {
    console.log(err);
  });
  }
})

/* POST push book reading now array */
router.post(`/readingNow-books`, checkForAuth, (req,res) => {
  if (req.user.readingNow.includes(req.body._id)){
    User.findByIdAndUpdate(req.user._id, {$pull: {readingNow:req.body._id}})
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {readingNow:req.body}})
      .then((result)=>{
      res.redirect('/profile')
      })
    })
    .catch((err) => {
      console.log(err);
    });
    }
  if (req.user.wishlist.includes(req.body._id)){
    User.findByIdAndUpdate(req.user._id, {$pull: {wishlist:req.body._id}})
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {readingNow:req.body}})
      .then((result)=>{
      res.redirect('/profile')
      })
    })
    .catch((err) => {
      console.log(err);
    });
    }
  if (req.user.booksFinished.includes(req.body._id)){
    User.findByIdAndUpdate(req.user._id, {$pull: {booksFinished:req.body._id}})
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {readingNow:req.body}})
      .then((result)=>{
      res.redirect('/profile')
      })
    })
    .catch((err) => {
      console.log(err);
    });
    }
})

/* POST push book wishlist array */
router.post(`/wishlist`, checkForAuth, (req,res) => {
  if (req.user.readingNow.includes(req.body._id)){
    User.findByIdAndUpdate(req.user._id, {$pull: {readingNow:req.body._id}})
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {wishlist:req.body}})
      .then((result)=>{
      res.redirect('/profile')
      })
    })
    .catch((err) => {
      console.log(err);
    });
    }
  if (req.user.wishlist.includes(req.body._id)){
    User.findByIdAndUpdate(req.user._id, {$pull: {wishlist:req.body._id}})
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {wishlist:req.body}})
      .then((result)=>{
      res.redirect('/profile')
      })
    })
    .catch((err) => {
      console.log(err);
    });
    }
  if (req.user.booksFinished.includes(req.body._id)){
    User.findByIdAndUpdate(req.user._id, {$pull: {booksFinished:req.body._id}})
    .then((result) => {
      User.findByIdAndUpdate(req.user._id, {$push: {wishlist:req.body}})
      .then((result)=>{
      res.redirect('/profile')
      })
    })
    .catch((err) => {
      console.log(err);
    });
    }
})

/* GET change password */
router.get(`/edit/password/:_id`,(req,res) => {
  if(req.user.id === req.params._id || admin===true){
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render(`edit-password`, {id:req.params._id ,layout:layout}
    )
  }else{res.send(`You can't change other user's password`)}
})

/* GET render edition of profile */  
router.get(`/edit/:edit/:_id`,(req,res) => {
  if(req.user.id === req.params._id || admin===true){
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render(`edit-profile`, {edits:req.params, layout:layout}
    )
  }else{res.send(`You can't edit other user's profile`)}
})

/* POST Change password */
router.post(`/edit/password/:_id`,checkForAuth,(req,res) => {
  const password = req.body.password
  if (password.length < 8){
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render(`edit-password`, {errorMessage: `La contraseña ha de tener una longitud mínima de 8 caracteres`, layout: layout})
  }else {
const hashedPassword = bcrypt.hashSync(password, 10)
User.findByIdAndUpdate(req.params._id, {password: hashedPassword})
.then((result)=>{
res.redirect(`/profile`)
})
.catch((err)=>{
console.log(err)
})
}

})

/* POST Change avatar */
router.post(`/edit/avatar/:_id`,checkForAuth,(req,res) => {
  User.findByIdAndUpdate(req.params._id, {avatar:req.body.avatar})
  .then((result)=>{
    res.redirect(`/profile`)
    })
    .catch((err)=>{
    console.log(err)
    })
})

/* POST Change phrase */
router.post(`/edit/phrase/:_id`,checkForAuth,(req,res) => {
  User.findByIdAndUpdate(req.params._id, {phrase:req.body.phrase})
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
    res.redirect('/profile')
  })
  .catch((error)=>{
    res.send(error)
  })
})

/* GET user list */
router.get(`/list`, checkForAuth, (req,res) => {
  User.find({})
  .then((result)=>{
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render(`user-list`, {users:result,admin, layout: layout})
    })
    .catch((err)=>{
    console.log(err)
    })
})
    
/* GET profile page */
  router.get('/user/:_id', checkForAuth ,(req, res) => {
    if (admin === true){
    User.findById(req.params._id)
    .populate(`booksFinished`)
    .populate(`readingNow`)
    .populate(`wishlist`)
    .then((result) => {
      const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
      res.render('profile', {data:result,admin, layout: layout})
    })
    .catch((err) => {
      console.log(err); 
    });
  }else{res.send(`You don't have permissions to see this page`)}
})
  
/* GET delete profile */
  
  router.get(`/user/delete/:_id`,(req,res) => {
  if (admin === true){
    if(req.user._id != req.params._id){
    User.findByIdAndDelete(req.params._id)
    .then((result)=>{
    res.redirect(`/profile/list`)
    })
    .catch((err)=>{
    console.log(err)
    })
    } else{res.redirect(`/profile/list`)}
  }else{res.send(`You don't have permissions to see this page`)}
})

  
module.exports = router;