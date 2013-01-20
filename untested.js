var util = require('util');
var fs = require('fs');
var options = require('./src/options').run();
console.assert(options, 'could not command line options');

var addTestPoint = require('./src/addTestPoint').addTestPoint;
var dataStore = require('./src/dataStore');

if (options.info) {
	dataStore.showInfo();
	process.exit(0);
}

if (options.reset) {
	dataStore.reset();
	process.exit(0);
}

if (options.test && options.coverage) {
	addTestPoint(options);
} else if (options.affected) {
	console.assert(Array.isArray(options.affected), 'expected affected to be an array');
	console.log('computing list of tests affected by changes in\n', options.affected);
	var tests = dataStore.findAffected(options.affected);
	var info = JSON.stringify(tests, null, 2);
	if (options.output) {
		fs.writeFileSync(options.output, info, 'utf-8');
		console.log('saved', tests.length, 'affected tests names to', options.output);
	} else {
		console.log(JSON.stringify(tests, null, 2));
	}
}