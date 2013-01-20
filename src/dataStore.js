var fs = require('fs');
var path = require('path');
var util = require('util');
var _ = require('lodash');

var filename = path.resolve('testPoints.json');
var tab = ' '; // console.log adds extra space

function loadExistingTestPoints() {
	var data = {};
	if (fs.existsSync(filename)) {
		data = require(filename);
		// console.log('loaded data from', filename);
	} else {
		console.log('starting new data store');
	}
	return data;
}

function saveDataStore(data) {
	console.log('saving data store to', filename);

	data = data || {};
	fs.writeFileSync(filename, JSON.stringify(data), 'utf-8');
	// console.log(util.inspect(data, true, 2));
	console.log('saved test info data into', filename);
}

function showInfo() {
	var data = loadExistingTestPoints();
	var n = Object.keys(data).length;
	if (!n) {
		console.log('empty test data store');
		return;
	}
	console.log('Test data from', filename);
	console.log(n + ' test points');
	Object.keys(data).forEach(function (testName) {
		var coverage = data[testName];
		console.log(testName, 'covers', Object.keys(coverage).length, 'files');
		Object.keys(coverage).forEach(function (coveredName) {
			var covered = coverage[coveredName];
			console.log(tab, covered.name, covered.coverage);
		});		
	});
}

function reset() {
	console.warn('resetting test info');
	saveDataStore({});
}

exports.loadExistingTestPoints = loadExistingTestPoints;
exports.saveDataStore = saveDataStore;
exports.showInfo = showInfo;
exports.reset = reset;