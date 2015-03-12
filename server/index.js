var express = require('express'),
    bodyParser = require('body-parser'),
    morgan =  require('morgan'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    app = express();

app.set('port', (process.env.PORT || 5000));

app.use(errorHandler({dumpExceptions: true, showStack: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/../public'));

app.use('/api', morgan('dev'));

app.use('/api/msw', require('./routes/msw'));

app.use(require('./middleware/notFound'));
app.use(require('./middleware/handleError'));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
