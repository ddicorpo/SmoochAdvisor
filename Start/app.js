var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var rp = require('request-promise');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/smooch/webhook', function (req, res) {
    var message = req.body.messages[0].text;
    console.log(message);
    var options = {
      uri: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        key: 'AIzaSyBUY6vp9g8CzxSrtCAJFiHg8mrTiaT_1KQ', // -> uri + '?access_token=xxxxx%20xxxxx'
        address: message
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

rp(options)
    .then(function (location) {
      console.log(location.bounds.northeast.lat);
      return rp({
        uri: 'https://tripadvisor....'
      })
        console.log('User has %d repos', repos.length);
    })
    .then(function (tripAdvisorResponse) {
      smooch.postMessage('here are all the cool restaurants')
    })
    .catch(function (err) {
        // API call failed...
    });
    req.send({message:"Todo"});
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
