var assert = require("assert")

describe('Util', function () {
    var util = require('../util.js');
    describe('parseDateFromTitle()', function () {

        it('The Date is Correctly extracted', function () {
            assert(util.parseDateFromTitle('Fri 6/01 : 3 Stars').toString().indexOf('Jan 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/02 : 3 Stars').toString().indexOf('Feb 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/03 : 3 Stars').toString().indexOf('Mar 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/04 : 3 Stars').toString().indexOf('Apr 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/05 : 3 Stars').toString().indexOf('May 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/06 : 3 Stars').toString().indexOf('Jun 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/07 : 3 Stars').toString().indexOf('Jul 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/08 : 3 Stars').toString().indexOf('Aug 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/09 : 3 Stars').toString().indexOf('Sep 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/10 : 3 Stars').toString().indexOf('Oct 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/11 : 3 Stars').toString().indexOf('Nov 06') >= 0);
            assert(util.parseDateFromTitle('Fri 6/12 : 3 Stars').toString().indexOf('Dec 06') >= 0);
        });
    });

    describe('parsePlaceFromChannelTitle', function () {
    // '/Machrihanish-Surf-Report/85/'
        it('gets a correct one word name', function () {
            assert(util.parsePlaceFromChannelTitle('Latest Machrihanish Surf Forecast').indexOf('Machrihanish') >= 0);
        });

        it('gets a correct two word name', function () {
            assert(util.parsePlaceFromChannelTitle('Latest Borth / Ynyslas  Surf Forecast').indexOf('Borth / Ynyslas') >= 0);
        });
    });


    describe('parseForcastFromDescription', function () {
        it('correctly parses the forcast', function () {
            var forcastString = "\n\tRating :: 3 Stars. Swell :: 11.5 ft @ 16 secs. Wind :: 29mph SSW\t";

            var forcast = {
                rating: 3,
                swell: {
                    height: 11.5,
                    period: 16
                },
                wind: {
                    speed: 29,
                    direction: 'SSW'
                }
            };
            assert.deepEqual(util.parseForcastFromDescription(forcastString), forcast);

            forcastString = "\n\tRating :: 1 Stars. Swell :: 9.5 ft @ 14 secs. Wind :: 15mph WSW\t";

            var forcast = {
                rating: 1,
                swell: {
                    height: 9.5,
                    period: 14
                },
                wind: {
                    speed: 15,
                    direction: 'WSW'
                }
            };
            assert.deepEqual(util.parseForcastFromDescription(forcastString), forcast);


        });
    });
});
