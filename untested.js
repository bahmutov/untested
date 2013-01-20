var options = require('./src/options').run();
console.assert(options, 'could not command line options');

var dataStore = require('./src/dataStore');

var data = dataStore.loadExistingTestPoints();
console.assert(data, 'could not load existing test data');