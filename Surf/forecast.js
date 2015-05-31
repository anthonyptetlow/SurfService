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
	console.log(feed.rss.channel[0].title);
	var newFeed = {
		place: util.parsePlaceFromChannelTitle(feed.rss.channel[0].title[0])
	};

	newFeed.forecast = _.map(feed.rss.channel[0].item, function (item) {
		return {
			date: util.parseDateFromTitle(item.title[0]),
			weather: util.parseForcastFromDescription(item.description[0])
		};
	});
	return newFeed;
}

function getForecast(index) {
	var deferred = q.defer();
	var url = getUrl(index);

	request(url).then(function(data) {
		parser.parseString(data, function(error, result) {
			if (error) {
		        deferred.reject(error);
			}
			deferred.resolve(processRssFeed(result));
		});

	}, function (error) {
		deferred.reject(error);
	})

	return deferred.promise;
}

module.exports = {
	getForecast: getForecast
}
