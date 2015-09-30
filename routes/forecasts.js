var Forecast = require('../Surf/forecast.js');

function getForecast(req, res) {
    Forecast.get(req.params.locationId, req.user ? req.user.id : undefined)
    .then(function (data) {
        console.log(data);
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    }).catch(function(error) {
        res.status(500).send(error);
    });
}


function getForecastFromWWO(req, res) {
    Forecast.getForecastFromWWO(req.params.latitude, req.params.longitude)
    .then(function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send(error);
    });
}
module.exports = {
    get: getForecast,
    getWWO: getForecastFromWWO
};
