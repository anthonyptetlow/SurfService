var express = require('express'),
    bodyParser = require('body-parser'),
    morgan =  require('morgan'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    mongoose   = require('mongoose'),
    app = express()
    tokenCheck = require('./middleware/tokenCheck.js');


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


var serverVersion = 'v0.0';
//Forcast api and legacy surf api
app.use('/api/surf/' + serverVersion, require('./routes/msw'));


serverVersion = 'v0.1';
var Locations = require('./routes/locations.js');
SurfRouter = express.Router();

//Set the base url for the router
app.use('/api/surf/' + serverVersion, SurfRouter);

//Location URLs
SurfRouter.get('/locations', Locations.getAll);
SurfRouter.get('/locations/find/:partialName', Locations.find);
SurfRouter.post('/locations', Locations.create);

//Location Favorite URLs
SurfRouter.get('/locations/favourite', tokenCheck, Locations.favourites.get);
SurfRouter.post('/locations/favourite', tokenCheck, Locations.favourites.add);
SurfRouter.delete('/locations/favourite', tokenCheck, Locations.favourites.remove);


//An Admin route to update the locations fro msw rss feed
SurfRouter.post('/locations/update/', Locations.updateFromMSW);

//404 and Error Pages
app.use(require('./middleware/notFound'));
app.use(require('./middleware/handleError'));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
