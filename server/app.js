// require libraries for express required--------------------------------------
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// require routers
const index = require('./routes/index');
const tanglerouter = require('./routes/tangle');
const statRouter = require('./routes/stat');
const searchRouter = require('./routes/node_search');
const chartRouter = require('./routes/chart');

const mongo_db = require('./config/config_mongo');

mongo_db.then(()=>{
  console.log('Connected correctly to mongodb');
}, (err) => {console.log(err);});

//start to serve the website-------------------------------------------------------

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb',extended: true}));
app.use(cookieParser());

//serve static resources in public folder
app.use(express.static(path.join(__dirname, 'public')));

//set all routers as middlewares of express
app.use('/', index);
app.use('/tangle', tanglerouter);
app.use('/stat', statRouter);
app.use('/node_search', searchRouter);
app.use('/chart', chartRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
