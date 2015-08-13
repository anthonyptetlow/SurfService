var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('Forecast',
	new Schema({
		location: {
			type: Number,
			ref: 'Location'
		},
		date: Date,
		weather: {
			rating: Number,
			swell: {
				height: Number,
				period: Number
			},
			wind: {
				speed: Number,
				direction: String
			}
		}
	})
);
