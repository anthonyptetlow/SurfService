var _ = require('lodash'),
	q = require('q'),
	Bottleneck = require('bottleneck');
var Forecast = require('./forecast.js'),
	Locations = require('./locations.js');

var limiter = new Bottleneck(5, 250);

module.exports = function updateAll() {
	return Locations.getLocations().then(function (locations) {
		return q.all(locations.map(function(location) {
			return Forecast.purgeForecast(location.id).then(function (locationId) {
				return limiter.schedule(Forecast.updateWWOForecast, locationId);
			});
		}).value());
	})
};
