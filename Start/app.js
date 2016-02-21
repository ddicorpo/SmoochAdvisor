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
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/smooch/webhook', function(req, res) {
  message = req.body.messages[0].text;
  if (req.body.trigger != "message:appUser") {
    res.sendStatus(200);
    return;
  }
  messageArray = message.split(",");
  smoochmsg = message.substring(0, 7);
  if (smoochmsg != "#Smooch") {
    console.log("noSmooch");
    id = req.body.appUser._id;
    var options = {
      uri: 'https://api.smooch.io/v1/appusers/' + id + "/conversation/messages",
      method: 'POST',
      body: {
        text: "Welcome to Smooch Advisor, to use our service please begin you're message with #Smooch, follow this with an address/location and end you're message with one of three options: restaurants, hotels or attractions. Ex :(#Smooch 4136 stephanie laval hotels)",
        role: "appMaker"
      },
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjU2YzhmMDA2MzRmMTg4MmEwMGVjOWZhMCJ9.eyJzY29wZSI6ImFwcCIsImlhdCI6MTQ1NjAzNzAzMn0.d9rqaYZ9Jc4wzrA6ZSx5Vqw-OTTZ8jsBLoNetdQGMWU',
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(options).then(function() {
      res.sendStatus(200);
      res.end();
    }).catch(function(err) {
      console.log('err::', err);
    });
  }
  message = message.substring(7);
  console.log(message);
  if (message.search("hotels") > 0) {
    adresss = message.substring(0, message.search("hotels"));
    fun = "hotels";
  }
  if (message.search("attractions") > 0) {
    adresss = message.substring(0, message.search("attractions"));
    fun = "attractions";
  }
  if (message.search("restaurants") > 0) {
    adresss = message.substring(0, message.search("restaurants"));
    fun = "restaurants";
  }

  console.log(adresss);
  console.log(fun);
  var options = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: 'AIzaSyBUY6vp9g8CzxSrtCAJFiHg8mrTiaT_1KQ', // -> uri + '?access_token=xxxxx%20xxxxx'
      address: adresss
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(function(response) {

      var longitude = response.results[0].geometry.location.lng;
      var latitude = response.results[0].geometry.location.lat;

      console.log(message);

      var toSend = 'https://api.tripadvisor.com/api/partner/2.0/map/' + latitude + "," + longitude + "/" + fun;
      console.log(longitude);
      return rp({
        uri: toSend,
        qs: {
          key: '49023A7B275D49758A2BF5090635B67A'
        },
        json: true
      }).then(function(tripAdvisorResponse) {
        //response
        strToReturn = "";
        for (var i = 0; i < 10; i++) {
          strToReturn += fun.substring(0, fun.length - 1) + " " + (i + 1) + ": " + tripAdvisorResponse.data[i].name + " ";
        }

      }).then(function() {
        var id = req.body.appUser._id;
        var options = {
          uri: 'https://api.smooch.io/v1/appusers/' + id + "/conversation/messages",
          method: 'POST',
          body: {
            text: strToReturn,
            role: "appMaker"
          },
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjU2YzhmMDA2MzRmMTg4MmEwMGVjOWZhMCJ9.eyJzY29wZSI6ImFwcCIsImlhdCI6MTQ1NjAzNzAzMn0.d9rqaYZ9Jc4wzrA6ZSx5Vqw-OTTZ8jsBLoNetdQGMWU',
            'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
        };

        return rp(options);
      }).then(function() {
        res.sendStatus(200);
        res.end();
      }).catch(function(err) {
        res.status(500).send(err);
        console.log('err::', err);
      });
    });
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
