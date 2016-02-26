var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webhook = require('./webhook');
var rp = require('request-promise');
directionsKey = 'AIzaSyDF3Kz4oTM9dKFft-QAQ9bH537bipzU0h4';


/// mistaken BEGIN --------------------------------------------------------------------
var mistaken = function(id) {
  var options = {
    uri: 'https://api.smooch.io/v1/appusers/' + id + "/conversation/messages",
    method: 'POST',
    body: {
      text: "Welcome to George's SMS D0-IT-ALL, to use our service please begin you're message with #trip or #google and wait for the return message for further instructions.",
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
    return;
  }).catch(function(err) {
    console.log('err::', err);
  });
};
///mistaken END-------------------------------------------------------------------------
/// tripadvisor Begin -----------------------------------------------------------
var tripadvisor = function(message, id) {
  choice = "";
  var address = "";
  if (message.match(/hotels/g)) {
    choice = "hotels";
  } else if (message.match(/restaurants/g)) {
    choice = "restaurants";
  } else if (message.match(/attractions/g)) {
    choice = "attractions";
  } else {
    var tripDefault = {
      uri: 'https://api.smooch.io/v1/appusers/' + id + "/conversation/messages",
      method: 'POST',
      body: {
        text: "To use the trip options please begin the message with #trip next enter an address and finaly end the message with either attractions hotels or restaurants",
        role: "appMaker"
      },
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjU2YzhmMDA2MzRmMTg4MmEwMGVjOWZhMCJ9.eyJzY29wZSI6ImFwcCIsImlhdCI6MTQ1NjAzNzAzMn0.d9rqaYZ9Jc4wzrA6ZSx5Vqw-OTTZ8jsBLoNetdQGMWU',
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(tripDefault).then(function() {
      res.sendStatus(200);
      res.end();
      return;
    }).catch(function(err) {
      console.log('err::', err);
    });
  }
  address = message.replace("#trip", "").replace("#Trip", "").replace("hotels", "").replace("restaurants", "").replace("attractions", "");
  console.log(address);
  var trip = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: 'AIzaSyBUY6vp9g8CzxSrtCAJFiHg8mrTiaT_1KQ', // -> uri + '?access_token=xxxxx%20xxxxx'
      address: address
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(trip)
    .then(function(response) {
      console.log('1')
      console.log(response.results[0]);
      var longitude = response.results[0].geometry.location.lng;
      var latitude = response.results[0].geometry.location.lat;

      var toSend = 'https://api.tripadvisor.com/api/partner/2.0/map/' + latitude + "," + longitude + "/" + choice;

      return rp({
        uri: toSend,
        qs: {
          key: '49023A7B275D49758A2BF5090635B67A'
        },
        json: true
      }).then(function(tripAdvisorResponse) {
        //response
        console.log("4");
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
};
///tripadvisorfunction END ---------------------------------------------------------------------
///directions BEGIN ----------------------------------------------------------------------------
var directions = function(message) {
  message = message.replace("#google", "");
  var directionsArray = message.split(",");
  if (directionsArray.length != 2) {
    var tripDefault = {
      uri: 'https://api.smooch.io/v1/appusers/' + id + "/conversation/messages",
      method: 'POST',
      body: {
        text: "To use the directions option please begin the message with #google next enter the origin adress followed by a comma and finaly end with the destination adress",
        role: "appMaker"
      },
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjU2YzhmMDA2MzRmMTg4MmEwMGVjOWZhMCJ9.eyJzY29wZSI6ImFwcCIsImlhdCI6MTQ1NjAzNzAzMn0.d9rqaYZ9Jc4wzrA6ZSx5Vqw-OTTZ8jsBLoNetdQGMWU',
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(tripDefault).then(function() {
      res.sendStatus(200);
      res.end();
      return;
    }).catch(function(err) {
      console.log("heres the error");
      console.log('err::', err);
    });
  }
  var origin = directionsArray[0];
  var destination = directionsArray[1];
  var directionsOptions = {
    uri: 'https://maps.googleapis.com/maps/api/directions/json',
    qs: {
      key: directionsKey,
      origin: origin,
      destination: destination
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  return rp(directionsOptions)
    .then(function(directionsResponse) {

      var directionsToReturn = "";
      for (var x = 0; x < directionsResponse.routes[0].legs[0].steps.length; x++) {
        directionsToReturn = directionsToReturn + " -> " + directionsResponse.routes[0].legs[0].steps[x].html_instructions;
      }
      directionsToReturn = directionsToReturn.replace(/<(?:.|\n)*?>/gm, '');

      var options = {
        uri: 'https://api.smooch.io/v1/appusers/' + id + "/conversation/messages",
        method: 'POST',
        body: {
          text: directionsToReturn,
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
        return;
      }).catch(function(err) {
        console.log("heres the error");
        console.log('err::', err);
      });

    });
}

///directions END ------------------------------------------------------------------------------


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

app.post('/webhook', function(req, res) {

  if (req.body.trigger != "message:appUser") {
    res.sendStatus(200);
    return;
  }

  id = req.body.appUser._id;
  message = req.body.messages[0].text;
  console.log(message);
  if (!message.match(/trip/g) && !message.match(/google/g)) {

    console.log("Did not begin with #trip or #google");
    mistaken(id);
  }

  if (message.match(/trip/g)) {
    tripadvisor(message, id);
  }

  if (message.match(/google/g)) {
    directions(message);
  }
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
