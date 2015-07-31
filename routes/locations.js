var Locations = require('../Surf/locations.js');

// Locations Routing Functions
function getAll(req, res) {
    Locations.getLocations()
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}

function updateFromMSW(req, res) {
    Locations.updateAllLocations();
    res.status(200).send();
}

function findLocation(req, res) {
	Locations.searchLocations(req.params.partialName)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}

//Favourite Routing Functions
function getFavourites(req, res) {
    Locations.getFavourites(req.user.id)
    .then(function (locations){
        res.status(200).json(locations);
    }, function (error) {
        res.status(500).send(error);
    });
}

function createLocation(req, res) {
    Locations.createLocation(req.body.id, req.body.name)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
}


function addFavourtie(req, res) {
    Locations.saveFavourite(req.body.locationId, req.user.id)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
}

function removeFavorite(req, res) {
    Locations.deleteFavourite(req.query.locationId, req.user.id)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
}

module.exports = {
		getAll: getAll,
		find: findLocation,
		create: createLocation,
		updateFromMSW: updateFromMSW,
		favourites: {
			get: getFavourites,
			add: addFavourtie,
			remove: removeFavorite
		}
};
