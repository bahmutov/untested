var fs = require('fs');
var path = require('path');
var util = require('util');
var dataStore = require('./dataStore');

// replaces existing test point with the same name
function addTestPoint(options) {
	console.assert(options.test, 'missing test file filename');
	console.assert(options.coverage, 'missing coverage filename');
	console.assert(fs.existsSync(options.coverage), 'cannot find', options.coverage);

	var coverageData = require(options.coverage);
	 console.log('read coverage data from', options.coverage, '\n', 
		 util.inspect(coverageData, true, 2, true));

	var data = dataStore.loadExistingTestPoints();
	console.assert(data, 'could not load existing test data');

	options.test = path.resolve(options.test);
	data[options.test] = coverageData;

	dataStore.saveDataStore(data);
}

exports.addTestPoint = addTestPoint;