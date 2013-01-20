var options = require('./src/options').run();
console.assert(options, 'could not command line options');

var fs = require('fs');
var path = require('path');
var util = require('util');

console.assert(options.test, 'missing test file filename');
console.assert(options.coverage, 'missing coverage filename');
console.assert(fs.existsSync(options.coverage), 'cannot find', options.coverage);

var coverageData = require(options.coverage);
 console.log('read coverage data from', options.coverage, '\n', 
	 util.inspect(coverageData, true, 2, true));

var dataStore = require('./src/dataStore');

var data = dataStore.loadExistingTestPoints();
console.assert(data, 'could not load existing test data');

options.test = path.resolve(options.test);
data[options.test] = coverageData;

dataStore.saveDataStore(data);
