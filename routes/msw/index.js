var express = require('express'),
    // tokenCheck = require('../../middleware/tokenCheck.js'),
    router = express.Router(),
    q = require('q');

var Surf = require('../../Surf');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.get('/forecast/:spot_id', function (req, res) {
    Surf.forecast.getForecast(req.params.spot_id)
    .then(function (data) {
        res.json(data).end();
    }, function (error) {
        res.status(500).send(error);
    });
});

router.get('/locations', function (req, res) {
    Surf.locations.getLocations()
    .then(function (data) {
        res.json(data).end();
    }, function (error) {
        res.status(500).send(error);
    });
});


router.get('/locations/update', function (req, res) {
    Surf.locations.updateAllLocations();
    res.status(200).send();
});

router.get('/locations/find/:partialName', function (req, res) {
    Surf.locations.searchLocations(req.params.partialName)
    .then(function (data) {
        res.json(data).end();
    }, function (error) {
        res.status(500).send(error);
    });
});

router.post('/locations', function (req, res) {
    Surf.locations.createLocation(req.body.id, req.body.name)
    .then(function (data) {
        res.json(data).end();
    }, function (error) {
        res.status(500).send(error);
    });
});



module.exports = router;
