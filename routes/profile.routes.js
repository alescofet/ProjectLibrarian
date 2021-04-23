const express = require('express');
const router  = express.Router();
const User = require('../models/User.model')

//Middleware de checkForAuth
const checkForAuth = (req,res,next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}
/* GET Home page */
router.get('/', checkForAuth ,(req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    const data = {...req.user._doc}
  
    res.render('profile', {data, layout})
})

module.exports = router;