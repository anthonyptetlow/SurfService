var express = require('express'),
    tokenCheck = require('../middleware/tokenCheck.js'),
    optionalTokenCheck = require('../middleware/optionalTokenCheck.js');

var serverVersion = 'v0.2';

var Locations = require('./locations.js'),
    Forecasts = require('./forecasts.js'),
    Regions = require('./regions.js'),
    Sitemaps = require('./sitemap.js'),
    Search = require('./search.js');

SurfRouter = express.Router();

SurfRouter.get('/', function(req, res) {
    res.send('Welcome to the Surf Service ' + serverVersion);
});

SurfRouter.get('/locations/find/:partialName', Search.searchLocationsAndRegion);

//Forecast Urls
SurfRouter.get('/forecast/:locationId' ,optionalTokenCheck, Forecasts.get);
// SurfRouter.get('/forecast/:latitude/:longitude', Forecasts.getWWO);

//Location Favorite URLs
SurfRouter.get('/locations/favourite', tokenCheck, Locations.favourites.get);
SurfRouter.post('/locations/favourite', tokenCheck, Locations.favourites.add);
SurfRouter.delete('/locations/favourite', tokenCheck, Locations.favourites.remove);

//Location URLs
SurfRouter.get('/locations', Locations.getAll);
SurfRouter.get('/locations/:locationId', Locations.get);

SurfRouter.get('/regions/locations/:regionId', Locations.getLocationsInRegion);

// SurfRouter.get('/locations/find/:partialName', Locations.find);
SurfRouter.post('/locations', Locations.create);

//Location URLs
SurfRouter.get('/regions', Regions.getAll);
SurfRouter.get('/regions/find/:partialName', Regions.find);
SurfRouter.get('/regions/:regionId', Regions.get);
SurfRouter.post('/regions', Regions.create);


SurfRouter.get('/sitemap/location', Sitemaps.locations);
SurfRouter.get('/sitemap/region', Sitemaps.regions);


SurfRouter.get('/update/', require('./forecastRetriever.js'));

module.exports = SurfRouter;
