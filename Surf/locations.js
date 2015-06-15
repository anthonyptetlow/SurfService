var q = require('q'),
	_ = require('lodash'),
	forecast = require('./forecast.js');

var LocationModel = require('./models/Location.js');

function stripDatabaseLocation(location) {
	return {
		id: location._id,
		name: location.name
	};
}

function createLocation(id, name) {
	var deferred = q.defer();
	var location = new LocationModel();
	location._id = id;
	location.name = name;
	location.save(function (error) {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function getAllLocations() {
	var deferred = q.defer();
	LocationModel.find(function (error, locations) {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve(_(locations).map(stripDatabaseLocation));
		}
	});
	return deferred.promise;
}


function searchLocations(partialName) {
	var deferred = q.defer();
	LocationModel.find({name: new RegExp(partialName, 'i')} , function (error, locations) {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve(_(locations).map(stripDatabaseLocation));
		}
	});
	return deferred.promise;
}

function updateAllLocations() {
	for(i = 1; i < 5050; i ++) {
	// for(i = 616; i < 618; i ++) {
		forecast.getForecast(i).then(function (data) {
			createLocation(data.place.id, data.place.name);
		}
		// , function (er) {
		//TODO Add code to log failures
		// }
		);
	}
}

module.exports = {
	createLocation: createLocation,
	getLocations: getAllLocations,
	searchLocations: searchLocations,
	updateAllLocations: updateAllLocations
};
