var spawn = require('child_process').spawn;
var path = require('path');
var gt = require('gt/covered');

function _test (tool, test) {
	gt.init({
		module: [test],
		colors: true
	});
	gt.run();
}

function runTest (test) {
	console.assert(test, 'expected a test');
	if (/\.js$/.test(test)) {
		_test('gt', test);
	} else {
		console.error('cannot determine how to run unit test', test);
	}
}

function runTests (tests) {
	console.assert(Array.isArray(tests), 'expected list of tests, not', tests);
	tests.forEach(function (test) {
		runTest(test.name); 
	});
}

exports.run = runTests;