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

addTestPoint(options);