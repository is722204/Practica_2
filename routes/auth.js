
const express = require('express');
const router = express.Router();
const passport=require("passport")
const data =require('../functions/users')




router.get("/logout",(req,res)=>{
    req.logOut()
    res.redirect("http://localhost:3000/animals")
})

router.get("/login",(_,res)=>{
    res.render("login")
})

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get(
    '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    //console.log(req.query.code)
    // Successful authentication, redirect home.
    //console.log(req.user)
    res.redirect('/profile');
  });
module.exports=router;