var Search = require('../Surf/search.js');

function searchLocationsAndRegion(req, res) {
	Search.findLocations(req.params.partialName)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}


module.exports = {
		searchLocationsAndRegion: searchLocationsAndRegion
};
