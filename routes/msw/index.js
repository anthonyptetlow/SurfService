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

module.exports = router;
