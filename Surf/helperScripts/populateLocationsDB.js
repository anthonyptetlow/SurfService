var location = require('../locations.js'),
	locationData = require('./oldLocationData.js'),
    mongoose   = require('mongoose'),
    _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/SurfStore'); // connect to our database

locationData.forEach(function (loc) {
	console.log(loc);
	location.createLocation(loc);
});
