const express = require('express');
const router  = express.Router();
const User = require(`../models/User.model`)
const bcrypt = require(`bcrypt`)
const passport = require(`passport`)

let image =``
const assignAvatar=()=>{
  randomNumber = Math.floor(Math.random()*8)
  image = {
    0: "/images/anonymous-mask.svg",
    1: "/images/homer-simpson.svg",
    2: "/images/iron-man.svg",
    3: "/images/jason-voorhees.svg",
    4: "/images/luigi.svg",
    5: "/images/scream.svg",
    6: "/images/super-mario.svg",
    7: "/images/walter-white.svg"
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
    res.status(202).render('signup', {image, layout: layout});
  });


  /* GET login */

  router.get('/login', (req, res, next) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth' 
    res.status(202).render('login', {errorMessage: req.flash(`error`), layout: layout});
  });


  /* POST signup page */

  router.post('/signup', (req, res, next) => {
    const {username, password, avatar} = req.body

    if(username===`` || password===``){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
      res.status(202).render(`signup`, {errorMessage: `Tienes que rellenar todos los campos`, layout: layout})

    } else if(password.length < 8){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.status(202).render(`signup`, {errorMessage: `La contraseña ha de tener una longitud minima de 8 caracteres`, layout: layout})

    }else{
    User.findOne({username})
    .then((user)=>{

    if(user){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.status(202).render(`signup`, {errorMessage:`Este usuario ya existe`, layout: layout})
        
    } else{
      const hashedPassword = bcrypt.hashSync(password, 10)
      User.create({username, password: hashedPassword, avatar})
      .then((result)=>{
        res.redirect(`/login`);
      })
    }
    })
    .catch((err)=>{
      res.status(400).send(err)
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