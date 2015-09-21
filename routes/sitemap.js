var Sitemap = require('sitemap');

var Locations = require('../Surf/locations.js');

function stringToURL(value) {
    return (!value) ? '' : value.trim().replace(/ /g, '-').replace('\'', '-');
}

function generateForecastSitemapObj(location) {
    return {
        url: '/forecast/' +  stringToURL(location.name) + '/' + location.id,
        changefreq: 'daily',
        priority: 1
    };
}

function generateForecastUrls() {
   return Locations.getLocations().then(function(locations) {
        return locations.map(generateForecastSitemapObj);
    });
}

function generateLocationsSitemap(req, res) {
    generateForecastUrls()
    .then(function (data) {
        sitemap = Sitemap.createSitemap ({
            hostname: 'http://surfpotter.eu',
            cacheTime: 600000,        // 600 sec - cache purge period
            urls: data.toJSON()
        });

        sitemap.toXML( function (err, xml) {
            if (err) {
                res.status(500).end();
            } else {
                res.header('Content-Type', 'application/xml');
                res.send( xml );
            }
        });
    }, function (error) {
        res.status(500).send(error);
    });
}


module.exports = {
    locations: generateLocationsSitemap
};
