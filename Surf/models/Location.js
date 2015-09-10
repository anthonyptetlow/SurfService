var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('Location',
	new Schema({
		name: String,
		bearchPerp: Number,
		bayImagePath: String,
		image: String,
		location: {
			type: [Number],
			index: '2dsphere',
			defualt: undefined
		}
	})
);

// schema.pre('save', function (next) {
//   if (this.isNew && Array.isArray(this.location) && 0 === this.location.length) {
//     this.location = undefined;
//   }
//   next();
// })
