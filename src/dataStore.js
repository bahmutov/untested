var fs = require('fs');
var path = require('path');
var util = require('util');

var filename = path.resolve('testPoints.json');

function loadExistingTestPoints() {
	var data = {};
	if (fs.existsSync(filename)) {
		data = require(filename);
		console.log('loaded data from', filename);
	} else {
		console.log('starting new data store');
	}
	return data;
}

function saveDataStore(data) {
	console.log('saving data store to', filename);

	data = data || {};
	fs.writeFileSync(filename, JSON.stringify(data), 'utf-8');

	var txt = util.inspect(data, true, 2);
	console.log(txt);
	console.log('saved test info data into', filename);
}

exports.loadExistingTestPoints = loadExistingTestPoints;
exports.saveDataStore = saveDataStore;