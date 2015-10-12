var cron = require('node-schedule');

var ForecastRetriever = require('../Surf/ForecastRetriever.js');

function initialiseCrons () {

	cron.scheduleJob('0 0 * * *', function () {
		ForecastRetriever().then(function (data) {
			console.log('CRON - Update Locations - Completed '  + new Date());
		});
		console.log('CRON - Update Locations - Started ' + new Date());
	})
}

module.exports = {
	initialise: initialiseCrons
};
