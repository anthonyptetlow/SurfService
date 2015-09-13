var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('FavouriteLocation',
	new Schema({
		userId: Schema.Types.ObjectId,
		location: {
			type: Schema.Types.ObjectId,
			ref: 'Location'
		}
	})
);


