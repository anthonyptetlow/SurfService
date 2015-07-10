var config = require('../config.json'),
	request = require('request-promise');

module.exports = function tokenCheck(req, res, next) {
	if (req.query.token) {
        request(config.userServiceURL + 'api/token/' + req.query.token).then(function(data) {
        	req.user = JSON.parse(data);
        	next();
        }, function () {
        	next();
        })
	} else {
    	next();
	}
}
