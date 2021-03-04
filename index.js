require("dotenv").config()
const express = require('express');
const path = require('path');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const hbs = require('express-handlebars');
const passport=require('passport')
const cookieSession=require('cookie-session')

const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const animals = require('./routes/animals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const profile = require('./routes/profile')

require('./config/passport')








const app = express();


// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  maxAge:24 *60 * 60 *1000,
  keys: ['clave']
}))


app.use(passport.initialize())
app.use(passport.session())



app.use('/animals', animals);
app.use('/users', users);
app.use('/auth',auth)
app.use('/profile',profile)


app.use((req,res,next)=>{
  res.locals.user = req.user;
  next()
});









 //catch 404 and forward to error handler
 //app.use(function(req, res, next) {
 //  next(createError(404));
 //});


// app.use(function(err, req, res, next) {
  // res.locals.message = err.message;
  // res.status(err.status || 500);
   //res.render('error');
//});


app.listen(3000, () => console.log('Listening on port 3000'));
