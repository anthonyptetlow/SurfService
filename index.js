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

var apicache = require('apicache').middleware;

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
    Sitemaps = require('./routes/sitemap.js'),
    Search = require('./routes/search.js');
SurfRouter = express.Router();

//Set the base url for the router
app.use('/api/surf/v0.2', require('./routes/Surf_0.2.js'));

app.use('/api/surf/v0.3', require('./routes/Surf_0.3.js'));



var cron = require('./cron');
    cron.initialise();

//404 and Error Pages
app.use(require('./middleware/notFound'));
app.use(require('./middleware/handleError'));

app.listen(app.get('port'), function() {
  console.log("Surf Service is running at localhost:" + app.get('port'));
});
