var fs = require('fs');
var path = require('path');
var util = require('util');
var dataStore = require('./dataStore');

// replaces existing test point with the same name
function addTestPoint(options) {
	console.assert(options.test, 'missing test file filename');
	console.assert(options.coverage, 'missing coverage filename');

	var coverageData;
	if (typeof options.coverage === 'string') {
		console.log('reading coverage from', options.coverage);
		console.assert(fs.existsSync(options.coverage), 'cannot find', options.coverage);
		coverageData = JSON.parse(fs.readFileSync(options.coverage, 'utf-8'));
	} else {
		coverageData = options.coverage;
	}

	// console.log('read coverage data from', options.coverage, '\n', 
	// 	util.inspect(coverageData, true, 2, true));

	var data = dataStore.loadExistingTestPoints();
	console.assert(data, 'could not load existing test data');

	var testPoints = options.test;
	if (!Array.isArray(testPoints)) {
		testPoints = [testPoints];
	}
	testPoints.forEach(function (testPoint) {
		testPoint = path.resolve(testPoint);
		data[testPoint] = coverageData;
	});

	dataStore.saveDataStore(data);
}

exports.addTestPoint = addTestPoint;