var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash')
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const app = express();


app.use(session({
  secret: "pass123",
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use((req, res, next) =>{
  app.locals.success_msg = req.flash("success_msg")
  app.locals.error_msg = req.flash("error_msg")
  next()
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(8082, () =>{
  console.log('connected')
})

module.exports = app;
