var express = require('express'),
    bodyParser = require('body-parser'),
    morgan =  require('morgan'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    mongoose   = require('mongoose'),
    app = express()
    tokenCheck = require('./middleware/tokenCheck.js'),
    optionalTokenCheck = require('./middleware/optionalTokenCheck.js');


var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/SurfStore'

mongoose.connect(mongoUri); // connect to our database

app.set('port', (process.env.PORT || 5005));

app.use(errorHandler({dumpExceptions: true, showStack: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Enable Route Logging
app.use('/api', morgan('dev'));

serverVersion = 'v0.2';
var Locations = require('./routes/locations.js'),
    Forecasts = require('./routes/forecasts.js'),
    Regions = require('./routes/regions.js'),
    Sitemaps = require('./routes/sitemap.js');
SurfRouter = express.Router();

//Set the base url for the router
app.use('/api/surf/' + serverVersion, SurfRouter);

SurfRouter.get('/', function(req, res) {
    res.send('Welcome to the Surf Service ' + serverVersion);
});

//Forecast Urls
SurfRouter.get('/forecast/:locationId', optionalTokenCheck, Forecasts.get);
// SurfRouter.get('/forecast/:latitude/:longitude', Forecasts.getWWO);

//Location Favorite URLs
SurfRouter.get('/locations/favourite', tokenCheck, Locations.favourites.get);
SurfRouter.post('/locations/favourite', tokenCheck, Locations.favourites.add);
SurfRouter.delete('/locations/favourite', tokenCheck, Locations.favourites.remove);

//Location URLs
SurfRouter.get('/locations', Locations.getAll);
SurfRouter.get('/locations/:locationId', Locations.get);
SurfRouter.get('/locations/find/:partialName', Locations.find);
SurfRouter.post('/locations', Locations.create);

//Location URLs
SurfRouter.get('/regions', Regions.getAll);
SurfRouter.get('/regions/:regionId', Regions.get);
SurfRouter.get('/regions/find/:partialName', Regions.find);
SurfRouter.post('/regions', Regions.create);


SurfRouter.get('/sitemap/location', Sitemaps.locations);

//404 and Error Pages
app.use(require('./middleware/notFound'));
app.use(require('./middleware/handleError'));

app.listen(app.get('port'), function() {
  console.log("Surf Service is running at localhost:" + app.get('port'));
});
