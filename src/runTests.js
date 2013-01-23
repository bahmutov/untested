var spawn = require('child_process').spawn;
var path = require('path');
var gt = require('gt/covered');
var lasso = require('lasso-node');

function jsTest(test) {
	console.assert(test, 'undefined js test');
	gt.init({
		module: [test],
		colors: true
	});
	gt.run();
}

function pageTest(test) {
	console.assert(test, 'undefined page test');
	lasso.run({
		page: test,
		untested: true
	});
}

function runTest (test) {
	console.assert(test, 'expected a test');
	if (/\.js$/.test(test)) {
		jsTest(test);
	} else if (/\.html$/.test(test)) {
		pageTest(test);
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