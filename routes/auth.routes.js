const express = require('express');
const router  = express.Router();
const User = require(`../models/User.model`)
const bcrypt = require(`bcrypt`)
const passport = require(`passport`)

let image =``
const assignAvatar=()=>{
  randomNumber = Math.floor(Math.random()*8)
  image = {
    0: 'anonymous',
    1: 'homer-simpson',
    2: 'iron-man',
    3: 'jason-voorhees',
    4: 'luigi',
    5: 'scream',
    6: 'super-mario',
    7: 'walter-white'
  }[randomNumber]
  return image}

//Middleware de checkForAuth 

const checkForAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
      return next()
    }else{res.redirect(`/login`)}
  }
  
  

  /* GET signup page */

  router.get('/signup', (req, res, next) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    assignAvatar()
    res.render('signup', {image, layout: layout});
    console.log(image)
  });


  /* GET login */

  router.get('/login', (req, res, next) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth' 
    res.render('login', {errorMessage: req.flash(`error`), layout: layout});
  });


  /* POST signup page */

  router.post('/signup', (req, res, next) => {
    const {username, password, avatar} = req.body

    if(username===`` || password===``){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
      res.render(`signup`, {errorMessage: `Tienes que rellenar todos los campos`, layout: layout})

    } else if(password.length < 8){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.render(`signup`, {errorMessage: `La contraseña ha de tener una longitud minima de 8 caracteres`, layout: layout})

    }else{
    User.findOne({username})
    .then((user)=>{

    if(user){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.render(`signup`, {errorMessage:`Este usuario ya existe`, layout: layout})
        
    } else{
      const hashedPassword = bcrypt.hashSync(password, 10)
      console.log(avatar)
      User.create({username, password: hashedPassword, avatar})
      .then((result)=>{
        res.redirect(`/login`);
      })
    }
    })
    .catch((err)=>{
      console.log(err)
    })
    };
  });


  /* POST login */
  router.post(`/login`, passport.authenticate(`local`, {
    successRedirect: `/profile`,
    failureRedirect:`/login`,
    failureFlash: true,
    passReqToCallback: true,
  }))
  
  
  /* GET Logout */
  router.get(`/logout`, (req, res)=>{
    req.logout()
    res.redirect('/')
  })
  
  
  module.exports = router;