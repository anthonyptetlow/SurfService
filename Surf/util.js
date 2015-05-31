function parseForcastFromDescription(desc) {
	// "\n\tRating :: 3 Stars. Swell :: 11.5 ft @ 16 secs. Wind :: 29mph SSW\t"
	var splitDesc = desc.split('::');
	return {
		rating: parseFloat(splitDesc[1]),
		swell: {
			height: parseFloat(splitDesc[2]),
			period: parseFloat(splitDesc[2].split('@')[1])
		},
		wind: {
			speed: parseFloat(splitDesc[3]),
			direction: splitDesc[3].split('mph')[1].trim()
		}
	};
};

function parsePlaceFromChannelTitle(field) {
	// '/Machrihanish-Surf-Report/85/'
	return field.replace(' Surf Forecast', '').replace('Latest ', '');
};

function parseDateFromTitle(field) {
// "Fri 6/03 : 3 Stars"
	var date = field.split(' : ')[0];
	var dayOfMonth = date.split(' : ')[0].split(' ')[1].split('/')[0];
	var month = parseInt(date.split(' : ')[0].split(' ')[1].split('/')[1]) - 1;
	var custDate = new Date();
	custDate.setMonth(month);
	custDate.setDate(dayOfMonth);
	return custDate;
};

module.exports = {
	parseForcastFromDescription: parseForcastFromDescription,
	parsePlaceFromChannelTitle: parsePlaceFromChannelTitle,
	parseDateFromTitle: parseDateFromTitle
};
