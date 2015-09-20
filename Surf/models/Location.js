var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('Location',
	new Schema({
		name: String,
		bearchPerp: Number,
		bayImagePath: String,
		image: {
			url: String,
			width: Number,
			height: Number
		},
		location: {
			type: [Number],
			index: '2dsphere',
			defualt: undefined
		},
		region : {
			type: Schema.Types.ObjectId,
			ref: 'Region'
		}
	})
);
// Europe UK + Ireland Scotland Inner Hebrides Machrihanish
// Continent, Country, Region , Subregion

// {
// 	regionName:
// 	parentRegion:
// }
// schema.pre('save', function (next) {
//   if (this.isNew && Array.isArray(this.location) && 0 === this.location.length) {
//     this.location = undefined;
//   }
//   next();
// })
