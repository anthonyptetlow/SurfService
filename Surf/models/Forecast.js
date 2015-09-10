var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('Forecast',
	new Schema({
		location: {
			type: Schema.Types.ObjectId,
			ref: 'Location'
		},
		date: Date,
		maxTemp: Number,
		minTemp: Number,
		sunrise: Date,
		sunset: Date,
		hourly: [{
			swell: {
				sigHeight: Number,
				height: Number,
				period: Number,
				direction: Number
			},
			wind: {
				speed: Number,
				gust: Number,
				direction: Number
			},
			temperature: Number
		}]
	})
);


// Test Document
// {
//     "_id" : ObjectId("55edc5d86464b31ea9d1e695"),
//     "location" : ObjectId("55edc5d86464b31ea9d1e694"),
//     "maxTempC" : 23,
//     "minTempC" : 21,
//     "hourly" : [
//         {
//             "swell" : {
//                 "sigHeight" : 1.2000000000000000,
//                 "height" : 0.3000000000000000,
//                 "direction" : 275
//             },
//             "wind" : {
//                 "speed" : 23,
//                 "gust" : 34,
//                 "direction" : 301
//             },
//             "temperature" : 23
//         }
//     ],
//     "__v" : 0
// }
