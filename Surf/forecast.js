var q = require('q'),
	rp =  require('request-promise');

var wwoKey = require('../config.json').wwoKey;
var baseUrl = 'http://api.worldweatheronline.com/premium/v1/marine.ashx?key=' + wwoKey + '&format=json&tp=24'

var Locations = require('./locations.js'),
	ForecastModel = require('./models/Forecast.js');

// API Parameters
// q - Latitude and longitude q=48.834,2.394
// fx - Whether to return weather forecast output. yes(D) or no
// format - The output format to return. xml(D) or json
// key - The API key.
// tp - Specifies the weather forecast time interval in hours. Options are: 1 hour, 3 hourly(D), 6 hourly, 12 hourly (day/night) or 24 hourly (day average).
// tide - To return tide data information if available yes no(D)

function getForecastFromWWO(latitude, longitude) {
	var options = {
	    uri : baseUrl + '&q=' + latitude + ',' + longitude,
	    method : 'GET'
	};
	return rp(options).then(function (data) {
		return JSON.parse(data);
	});
}


function getToday() {
    return new Date(new Date().setHours(0,0,0,0));
}


function getForecastFromStore(locationId) {
	// var deferred = q.defer();
	return ForecastModel.find({location: locationId}).populate('location').exec();
	// return deferred.promise;
}

function purgeForecastsForLocation(locationId) {
	var deferred = q.defer();

	ForecastModel.remove({location: locationId}, function (error) {
		if (error) {
			deferred.reject({error: 'UNKNOWN_DB_ERROR', message: 'An error occured when removing a favourite', errorData: error});
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function createFromWWOWeatherItem(locationId, data) {
	var deferred = q.defer();

	var weather = {
		location: '55ef2c3c578c651ac9ed08b4',
		date: data.date,
		maxTemp: data.maxtempC,
		minTemp: data.mintempC,
		// sunrise: data.astronomy[0].sunrise,
		// sunset: data.astronomy[0].sunrise,
		hourly: [{
			swell: {
				sigHeight: data.hourly[0].sigHeight_m,
				height: data.hourly[0].swellHeight_m,
				period: data.hourly[0].swellPeriod_secs,
				direction: data.hourly[0].swellDir
			},
			wind: {
				speed: data.hourly[0].windspeedKmph,
				gust: data.hourly[0].WindGustKmph,
				direction: data.hourly[0].winddirDegree
			},
			temperature: data.hourly[0].tempC
		}]
	};

	var forecastItem = new ForecastModel(weather);

	forecastItem.save(function (error) {
		if (error) {
			deferred.reject({error: 'UNKNOWN_DB_ERROR', message: 'An error occured when removing a favourite', errorData: error});
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function storeWeather(locationId, weather) {
	return q.all(weather.map(function (data) {
		return createFromWWOWeatherItem(locationId, data);
	}));
}


function getAndStoreWWOForecast(locationId) {

	return purgeForecastsForLocation(locationId).then(function () {
		return Locations.getLocation(locationId);
	}).then(function (data) {
		return getForecastFromWWO(data.coordinate.latitude, data.coordinate.longitude);
	}).then(function (result) {
 		return storeWeather(locationId, result.data.weather);
	}).then(function () {
		return getForecastFromStore(locationId);
	});
}

function getForecast(locationId) {
	return getForecastFromStore(locationId).then(function (forecast) {
		if (forecast.length >= 3) {
			console.log('Store Forecast Served');
			return forecast;
		} else {
			return getAndStoreWWOForecast(locationId);
		}
	});
}



module.exports = {
	get: getForecast,
	getForecastFromWWO: getForecastFromWWO
};
