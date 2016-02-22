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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/smooch/webhook', function (req, res) {
    var message = req.body.messages[0].text;
	array messageArray = message.split(",");
    console.log(message);
    var options = 
	{
		if ( messageArray.size == 3 )
		{
			 if ( messageArray[0] == "#Smooch")
			 {
				if ( messageArray[2] == "attractions" || messageArray[2] == "hotels" || messageArray[2] == "restaurants")
				{
					uri: 'https://maps.googleapis.com/maps/api/geocode/json',
			 
				qs:
				{
					key: 'AIzaSyBUY6vp9g8CzxSrtCAJFiHg8mrTiaT_1KQ', // -> uri + '?access_token=xxxxx%20xxxxx'
					address: message
				},
			  
				headers: 
				{
					'User-Agent': 'Request-Promise'
				},
			  
				json: true // Automatically parses the JSON string in the response
				}
				 else
				 {
					console.log("Hi, welsome to Smooch Advisor. Please choose either attractions, hotels or restaurants.  As as example: #Smooch, 1234 mason blvd, restaurant");
				 }
			 }
			else
			{
				console.log("Hi, welcome to Smooch Advisor. Begin your message with #Smooch, followed by an address/location and finally end the message with one of the 3 options, attractions/hotels/restaurants (Please use commas in between each section). As as example: #Smooch, 1234 mason blvd, restaurant"); 
			}
		}
		else
		{
			console.log("Hi, welcome to Smooch Advisor. Please use commas in between each section. As as example: #Smooch, 1234 mason blvd, restaurant");
		}
    };

rp(options)
    .then(function (response) {
      var longitude = response.results[0].geometry.location.lng;
      var latitude = response.results[0].geometry.location.lat;
      var toSend = 'https://api.tripadvisor.com/api/partner/2.0/map/'+latitude+","+longitude;
      console.log(longitude);
      return rp({
        uri: toSend,
        qs: {
          key: '49023A7B275D49758A2BF5090635B67A'
       },
       json: true
      })
    })
     .then(function (tripAdvisorResponse) {
      var name = tripAdvisorResponse.data[1].name;
      console.log(name);
      })
    .then(function () {
      res.end();
    })
    .catch(function (err) {1
        console.log('err::', err);
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
