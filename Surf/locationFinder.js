var forecast = require('./forecast.js');
var locations = require('./locations.js');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SurfStore'); // connect to our database

var notFound = 0;
for(i = 1; i < 5050; i ++) {
	forecast.getForecast(i).then(function (data) {
		console.log(data.place.id, data.place.name);
		locations.createLocation(data.place.id, data.place.name);
	});
}
