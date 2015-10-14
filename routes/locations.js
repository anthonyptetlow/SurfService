var Locations = require('../Surf/locations.js');

// Locations Routing Functions V0.2
function getAll(req, res) {
    Locations.getLocations()
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}

function getLocation(req, res) {
    Locations.getLocation(req.params.locationId)
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
    console.log(req.body);
    Locations.createLocation(req.body)
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

function getLocationsInRegion(req, res) {
    // console.log(req.query);
    Locations.getLocationsInRegion(req.params.regionId).then(function(data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
}

//V0.3

function getFromMachName(req, res) {
    Locations.getLocationFromMachineName(req.params.locationMachineName)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}



module.exports = {
		getAll: getAll,
        get: getLocation,
        getFromMachName: getFromMachName,
		find: findLocation,
        getLocationsInRegion: getLocationsInRegion,
		create: createLocation,
		updateFromMSW: updateFromMSW,
		favourites: {
			get: getFavourites,
			add: addFavourtie,
			remove: removeFavorite
		}
};
