var express = require('express'),
    tokenCheck = require('../../middleware/tokenCheck.js'),
    optionalTokenCheck = require('../../middleware/optionalTokenCheck.js'),
    router = express.Router(),
    q = require('q');

var Surf = require('../../Surf');

router.get('/', function (req, res) {
    res.send('Welcome to the API');
});

router.get('/forecast/:spot_id', optionalTokenCheck, function (req, res) {
    Surf.forecast.getForecast(req.params.spot_id)
    .then(function (data) {
        // add check for favourite
        if (req.user) {
            console.log(req.user);
            Surf.locations.isFavourite(data.place.id, req.user.id).then(function (isFave) {
                data.place.isFavourite = isFave;
                res.json(data);
            }, function (error) {
                res.status(500).json(error);
            });
        } else {
            res.json(data).end();
        }
    }, function (error) {
        res.status(500).send(error);
    });
});

router.get('/locations', function (req, res) {
    Surf.locations.getLocations()
    .then(function (data) {
        res.json(data);
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
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
});

router.post('/locations', function (req, res) {
    Surf.locations.createLocation(req.body.id, req.body.name)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
});

router.get('/locations/favourite', tokenCheck, function (req, res) {
    Surf.locations.getFavourites(req.user.id)
    .then(function (locations){
        res.status(200).json(locations);
    }, function (error) {
        res.status(500).send(error);
    })
});

router.post('/locations/favourite', tokenCheck, function (req, res) {
    Surf.locations.saveFavourite(req.body.locationId, req.user.id)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
});

router.delete('/locations/favourite', tokenCheck, function (req, res) {
    Surf.locations.deleteFavourite(req.body.locationId, req.user.id)
    .then(function (data) {
        res.json(data).send();
    }, function (error) {
        res.status(500).send(error);
    });
    // res.status(200).send();
});



module.exports = router;
