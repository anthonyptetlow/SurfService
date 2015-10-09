var cron = require('node-schedule');

var ForecastRetriever = require('../Surf/ForecastRetriever.js');

function initialiseCrons () {

	cron.scheduleJob('0 9 * * *', function () {
		ForecastRetriever().then(function (data) {
			console.log('CRON - Update Locations - Complete');
		});
		console.log('CRON - Update Locations');
	})
}

module.exports = {
	initialise: initialiseCrons
};
