var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var expressHbs = require('express-handlebars');
var fileUpload=require('express-fileupload')
var db=require('./config/connection')//database connection importing
var app = express();
var hbs = expressHbs.create({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname +'/views/layout/',partialsDir:__dirname+'/views/partials/'});
var session=require('express-session')
var cors=require('cors')



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine);
app.use(session({secret:"Key",cookie:{maxAge:60000000}}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

//connecting to database
db.connect((err)=>
{
  if(err)
   console.log("Error"+err)
  else{
    console.log("Database Connected Successfully")
  }
})


app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;