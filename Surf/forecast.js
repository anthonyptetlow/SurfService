var xml2js = require('xml2js'),
    request = require('request-promise'),
    q = require('q'),
    _ = require('lodash'),
    util = require('./util.js');

var ForecastModel = require('./models/Forecast.js');

var parser = new xml2js.Parser();

function getToday() {
    return new Date(new Date().setHours(0,0,0,0));
}

function getUrl(i) {
    return 'http://magicseaweed.com/syndicate/rss/index.php?id=' + i + '&unit=uk';
}

function processRssFeed(feed) {
    var newFeed;
    if (feed.rss) {

        newFeed = {
            place: {
                name: util.parsePlaceFromChannelTitle(feed.rss.channel[0].title[0])
            }
        };

        newFeed.forecast = _.map(feed.rss.channel[0].item, function (item) {
            return {
                date: util.parseDateFromTitle(item.title[0]),
                weather: util.parseForcastFromDescription(item.description[0])
            };
        });
    }
    return newFeed;
}

function getForecast(index) {
    var deferred = q.defer();

    //Check to see if we have a stored five day forecast
    getFiveDayForecast(index).then(function (forecast) {
        //If we have 5 days then serve it up
        if (forecast.length >= 5) {
            console.log('forecast', forecast);

            var data = {
                place: {
                    name: forecast[0].location.name,
                    id: index,
                },
                forecast: forecast,
                stored: true
            };

            deferred.resolve(data);
        //Else go to MSW RSS to get the data
        } else {
            try {
                var url = getUrl(index);
                request(url).then(function(data) {
                    parser.parseString(data, function(error, result) {
                        if (error) {
                            deferred.reject(error);
                        }
                        try {
                            var rssAsJson = processRssFeed(result);
                        } catch(e) {
                            deferred.reject(e);
                        }

                        if (!rssAsJson) {
                            deferred.reject({error: 'unable to parse json'});
                        } else {
                            rssAsJson.place.id = index;

                            // Once data is pulled from the api store it in the DB
                            rssAsJson.forecast.forEach(function(data){
                                saveForcastData(index, data)
                            });

                            deferred.resolve(rssAsJson);
                        }
                    });

                }, function (error) {
                    deferred.reject(error);
                });
            }
            catch (err) {
                deferred.reject({error: err, message: 'unable to retrive or parse msw'});
            }
        }
    });

    return deferred.promise;
}


function getFiveDayForecast(id) {
    var deferred = q.defer();
    ForecastModel.find({location: id,  date: {"$gte": getToday()}}).populate('location').exec(function (error, forecasts) {
        if (error) {
            deferred.reject({error: 'UNKNOWN_DB_ERROR', message: 'An error occured when finding location', errorData: error});
        } else if (forecasts == null) {
            deferred.reject({error: 'FORECAST_NOT_FOUND', message: 'No forecast data found'});
        } else {
            deferred.resolve(forecasts);
        }
    });
    return deferred.promise;
}

function findForecastForDate(id, date) {
    var deferred = q.defer();
    var day = new Date(date.setHours(0,0,0,0));
    var nextDay = new Date(new Date(day).setDate(day.getDate() + 1));

    ForecastModel.find({location: id, date: {"$gte": day, "$lt": nextDay}}, function (error, forecast) {
        if (error) {
            deferred.reject({error: 'UNKNOWN_DB_ERROR', message: 'An error occured when finding location', errorData: error});
        } else if (forecast == null) {
            deferred.reject({error: 'FORECAST_NOT_FOUND', message: 'No forecast data found'});
        } else {
            deferred.resolve(forecast);
        }
    });
    return deferred.promise;
}

function saveForcastData(id, data) {
    var deferred = q.defer();
    //Find existing entries and update them else create a new entry
    findForecastForDate(id, data.date).then(function(forecast) {
        if(forecast.length >= 1) {
            forecast[0].weather = data.weather;
            forecast[0].save(function (error) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                }            });
        } else {
            var ForecastObj = new ForecastModel({
                location: id,
                date: data.date,
                weather: data.weather
            });

            ForecastObj.save(function (error) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve();
                }
            });
        }
    });

    return deferred.promise;
}

module.exports = {
    getForecast: getForecast
}
