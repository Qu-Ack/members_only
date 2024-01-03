var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const strategy = require('./authentication')
var logger = require('morgan');
const User = require('./models/user')
const mongoose = require('mongoose');
const session = require('express-session')
require('dotenv').config();
const passport = require('passport')
// const mongoStore = require("connect-mongo");
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const MongoStore = require('connect-mongo');

var app = express();

// process.env.NODE_ENV = "production"
main();

// mongoose setup 
function main() {
  try {
    mongoose.connect(process.env.DB_STRING);
    console.log("connected to the database...")
  } catch (err) {
    console.log(err)
  }
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({username: username});
    const match = await bcrypt.compare(password, user.password);
    if (!user)
    {
      return done(null , false, {message: "Incorrect username"})
    } 
    if (!match)
    {
      return done(null, false, {message: "Incorrect Password"})
    }
    return done(null , user)
  } catch(err){
    done(err)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});



app.use(session({
  path:'/', 
  store: MongoStore.create({mongoUrl: process.env.DB_STRING}),
  resave:false,
  secret:process.env.secret,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 24 * 60 * 60,
  } 
} ));

app.use(passport.initialize())
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req,res) => {
  console.log(req)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
