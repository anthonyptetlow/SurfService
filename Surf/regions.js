var q = require('q'),
	_ = require('lodash');

var	RegionModel = require('./models/Region.js');

function createRegion(regionOptions) {
	var deferred = q.defer();
	var regionModel = new RegionModel();

	regionModel.name = regionOptions.name;
	regionModel.parentRegion = regionOptions.parentRegion;

	regionModel.save(function (error) {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function getRegion(regionId, child) {
	return RegionModel.findById(regionId).populate('ancestors').exec();
}



function getAllRegions() {
	return RegionModel.find().exec();
}


function searchRegions(partialName) {
	return RegionModel.find({name: new RegExp(partialName, 'i')});
}

module.exports = {
	createRegion: createRegion,
	getRegion: getRegion,
	getRegions: getAllRegions,
	searchRegions: searchRegions
};
