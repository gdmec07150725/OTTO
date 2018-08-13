var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');//引入body-parser模块@Express4.x版本,用于图片上传
//处理文件上传首先要用npm下载multer@0.1.8的版本模块和path模块
var multer = require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create application/json parser
app.use(bodyParser());
//解析json数据
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
//解析表单提交的数据
app.use(bodyParser.urlencoded({
    extended: false,
}));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type'}));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html'}));


//use multer module
app.use(multer());

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
