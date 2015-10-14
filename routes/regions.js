var Regions = require('../Surf/regions.js');

// Locations Routing Functions
function getAll(req, res) {
    Regions.getRegions()
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}

function getRegion(req, res) {
    Regions.getRegion(req.params.regionId)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}


function findRegion(req, res) {
	Regions.searchRegions(req.params.partialName)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}

function createRegion(req, res) {
    console.log(req.body);
    Regions.createRegion(req.body)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
}




function getRegionFromMachineName(req, res) {
    Regions.getRegionFromMachineName(req.params.regionMachineName)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}


module.exports = {
		getAll: getAll,
        get: getRegion,
        find: findRegion,
        create: createRegion,
        getFromMachineName: getRegionFromMachineName
};
