var q = require('q'),
	_ = require('lodash');


var Locations = require('./locations'),
	Regions = require('./regions');

function findLocations(partial) {
	console.log('Made it 1');
	return q.spread([
		Locations.searchLocations(partial),
		Regions.searchRegions(partial),
	], function(locations, regions) {


		return {
			locations: locations,
			regions: regions
		};
	});

}

module.exports = {
	findLocations: findLocations
}
