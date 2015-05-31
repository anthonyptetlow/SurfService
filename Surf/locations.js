var q = require('q'),
	_ = require('lodash');

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

module.exports = {
	createLocation: createLocation,
	getLocations: getAllLocations,
	searchLocations: searchLocations
};
