var Sitemap = require('sitemap');

var Locations = require('../Surf/locations.js'),
    Regions = require('../Surf/regions.js'),
    Util = require('../Util');


function stringToURL(value) {
    return (!value) ? '' : value.trim().replace(/ /g, '-').replace('\'', '-');
}

function generateForecastSitemapObj(location) {
    return {
        url: '/forecast/' +  location.machineName,
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
            hostname: 'http://surfspotter.eu',
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



function generateRegionSitemapObj(region) {
    return {
        url: '/region/' + region.machineName,
        changefreq: 'monthly',
        priority: 1
    };
}

function generateRegionUrls() {
   return Regions.getRegions().then(function(regions) {
        return regions.map(generateRegionSitemapObj);
    });
}

function generateRegionsSitemap(req, res) {
    generateRegionUrls()
    .then(function (data) {
        console.log(data);
        sitemap = Sitemap.createSitemap ({
            hostname: 'http://surfspotter.eu',
            cacheTime: 600000,        // 600 sec - cache purge period
            urls: data
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
    locations: generateLocationsSitemap,
    regions: generateRegionsSitemap
};
