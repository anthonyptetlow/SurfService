var config = require('../config.json'),
	request = require('request-promise');

module.exports = function tokenCheck(req, res, next) {
	if (req.query.token) {
        request(config.userServiceURL + 'api/token/' + req.query.token).then(function(data) {
        	req.user = JSON.parse(data);
        	next();
        }, function (error) {
			res.status(401).json(JSON.parse(error.response.body));
        });

	} else {
		res.status(401).json({error: 'NO_TOKEN', message: 'This is an authenticated URL, a valid token must be provided.'});
	}
};
