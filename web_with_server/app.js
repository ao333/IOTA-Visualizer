// require libraries for express required--------------------------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// require routers
var index = require('./routes/index');
var users = require('./routes/users');
var tanglerouter = require('./routes/tangle');

//connect mongodb----------------------------------------------------------------
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const IOTAes = require('./models/iotaes');

const url = 'mongodb://mongo-iota.documents.azure.com:10255/iota_project?ssl=true';
const connect = mongoose.connect(url,{
  auth:{
    user:"mongo-iota",
    password:"HPQk80YugoNOZafBxwRnIn5ioRSt8IsGkgvOstE01I69ZLJFT6MK5kvvMD6QIwm7KB3MUH7d4JrNQAiQ5UhiIg=="
  },
  keepAlive: 120
});

connect.then(()=>{
  console.log('Connected correctly to mongodb');
}, (err) => {console.log(err);});

//start to query information from IOTA continuously----------------------------------
const query_interval = require('./otherjs/query_interval');
//query_interval.query_tip();
//setInterval(query_interval.go_through_db, 300000);
//query_interval.go_through_db();

//start to serve the website-------------------------------------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/tangle', tanglerouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
