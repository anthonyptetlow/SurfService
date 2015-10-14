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

function getRegion(regionId) {
	return RegionModel.findById(regionId).populate('ancestors').exec();
}


function getAllRegions() {
	return RegionModel.find().exec();
}


function searchRegions(partialName) {
	return RegionModel.find({name: new RegExp(partialName, 'i')});
}


function getRegionFromMachineName(machineName) {
	return RegionModel.find({machineName: machineName}).populate('ancestors').exec().then(function (regions) { return regions[0];});
}


module.exports = {
	createRegion: createRegion,
	getRegion: getRegion,
	getRegions: getAllRegions,
	searchRegions: searchRegions,
	getRegionFromMachineName: getRegionFromMachineName
};
