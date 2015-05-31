
//usage node locationParser.js > file.js

var lineReader = require('line-reader');

var data = [];

console.log('module.exports = ');
lineReader.eachLine('data.txt', function(line, last) {
  // console.log(line);
  split = line.split(', ');


	data.push({
		id: parseInt(split[0]),
		name: split[1]
	});


  if (line === '\n') {
    return false; // stop reading
  }
}).then(function () {
    console.log(data);
  	console.log(';');
});

