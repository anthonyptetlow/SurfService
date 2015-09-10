var q = require('q'),
	_ = require('lodash');

var LocationModel = require('./models/Location.js'),
	FavouriteLocation = require('./models/FavouriteLocation.js');

function stripDatabaseLocation(location) {
	return {
		id: location._id,
		name: location.name,
		image: location.image,
		bayImagePath: location.bayImagePath,
		coordinate: {
			latitude: location.location[0],
			longitude: location.location[1]
		}
	};
}

function createLocation(locationOptions) {
	var deferred = q.defer();
	var location = new LocationModel();

	location.name = locationOptions.name;
	location.bearchPerp = locationOptions.bearchPerp;
	location.bayImagePat = locationOptions.bayImagePath;
	location.image = locationOptions.image;

	if((!!locationOptions.coordinate.longitude) && (!!locationOptions.coordinate.latitude)) {
		location.location = [locationOptions.coordinate.longitude, locationOptions.coordinate.latitude];
	}

	location.save(function (error) {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function getLocation(id) {
	var deferred = q.defer();
	LocationModel.findById(id, function (error, location) {
		if (error) {
			deferred.reject({error: 'UNKNOWN_DB_ERROR', message: 'An error occured when finding location', errorData: error});
		} else if (location == null) {
			deferred.reject({error: 'LOCATION_NOT_FOUND', message: 'No location data found'});
		} else {
			deferred.resolve(stripDatabaseLocation(location));
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

function getFavourites(userId) {
	var deferred = q.defer();
	FavouriteLocation.find({userId: userId}).populate('location').exec(function (error, favourites) {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve(favourites);
		}
	});
	return deferred.promise;
}

function saveFavourite(locationId, userId) {
	var deferred = q.defer();
	//Check location Exists
	getLocation(locationId).then(function (location) {
		//if it does check for existing favourite entry
		getFavourites(userId).then(function (favourites) {
			var matches = _.filter(favourites, function (favourite) {
				return favourite.location._id == locationId ;});
			if (matches.length > 0) {
				//If found then dont do anything as record exists
				deferred.resolve();
			} else {
				// else create favorite entry
				var entry = new FavouriteLocation();
				entry.userId = userId;
				entry.location = locationId;
					entry.save(function (error) {
					if(error) {
						deferred.reject(error);
					} else {
						deferred.resolve();
					}
				});
			}
		});
	}, function (error) {
		deferred.reject(error);
	});
	return deferred.promise;
}

function isFavourite(locationId, userId) {
	var deferred = q.defer();
	getFavourites(userId).then(function (favourites) {
		// console.log(favourites);
		var matches = _.filter(favourites, function (favourite) {
				return favourite.location._id.toString() == locationId ;});
		deferred.resolve(matches.length > 0);
	});
	return deferred.promise;
}

function deleteFavourite(locationId, userId) {
	var deferred = q.defer();

	FavouriteLocation.remove({location: locationId, userId: userId}, function (error) {
		if (error) {
			deferred.reject({error: 'UNKNOWN_DB_ERROR', message: 'An error occured when removing a favourite', errorData: error});
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
}

module.exports = {
	createLocation: createLocation,
	getLocations: getAllLocations,
	getLocation: getLocation,
	searchLocations: searchLocations,
	getFavourites: getFavourites,
	saveFavourite: saveFavourite,
	isFavourite: isFavourite,
	deleteFavourite: deleteFavourite
};
