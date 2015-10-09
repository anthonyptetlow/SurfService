var ForecastRetriever = require('../Surf/ForecastRetriever.js');

module.exports = function updateForecast(req, res) {
	ForecastRetriever()
	.then(function (data) {
		res.json(data).status(200);
	}).catch(function(error) {
		res.json(error).status(500);
	});
}
