var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;


var RegionSchema = new Schema({
		name: String,
		machineName: {
			type: String,
			unique: true
		},
		parentRegion: {
			type: Schema.Types.ObjectId,
			ref: 'Region'
		},
		ancestors: {
			type: [Schema.Types.ObjectId],
			ref: 'Region'
		}
	});

module.exports = mongoose.model('Region', RegionSchema);
// Europe UK + Ireland Scotland Inner Hebrides Machrihanish
// Continent, Country, Region , Subregion
