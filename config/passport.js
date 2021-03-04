const passport =require("passport")
const usuarios = require('../users')
const UsersGoogle = require('../functions/usersGoogle')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
    console.log("se mete a serializeUser")
});
  
passport.deserializeUser(function(user, done) {
    //User.findById(id, function(err, user) {
      //done(err, user);
    //});
    console.log("se mete a deserializeUser con el usuario: "+ user.GoogleID)
    UsersGoogle.findOrCreate(user)//Buscar en la base de datos si está, si no, regristarlo 
    //const user = users.find(id)  .then(user => done(null,user));
    done(null,user)
  });


passport.use(
    new GoogleStrategy(
    {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   
    var myUser={"TimeStamp":Date.now(),
                "GoogleID":profile.id,
                "email":profile.emails[0].value,
                "imageURL":profile.photos[0].value,
                "name":profile.displayName}
    //usuarios.users.push(myUser)
    console.log(profile)
    done(null,myUser)
  }
));