var xml2js = require('xml2js'),
    request = require('request-promise'),
    q = require('q'),
    _ = require('lodash'),
    util = require('./util.js');


var parser = new xml2js.Parser();

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
    var url = getUrl(index);
    try {
        request(url).then(function(data) {
            // console.log(data);
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

    return deferred.promise;
}

module.exports = {
    getForecast: getForecast
}
