var git = require('ggit');
var check = require('check-types');
var dataStore = require('./dataStore');
var fs = require('fs');

function showAffectedTests(filenames, outputFilename, runTests) {
	check.verify.array(filenames, 'expected source files to be an array');

	// console.log('computing list of tests affected by changes in\n', filenames);
	var tests = dataStore.findAffected(filenames);
	check.verify.array(tests, 'tests should be an array, not', tests);

	var info = JSON.stringify(tests, null, 2);
	if (outputFilename) {
		check.verify.unemptyString(outputFilename, 'expected output filename string');
		fs.writeFileSync(outputFilename, info, 'utf-8');
		console.log('saved', tests.length, 'affected tests names to', outputFilename);
	} else {
		console.log(tests.length ? 'Found ' + tests.length + ' test(s) to run'  : 'no tests need to be run');
	}
	if (runTests && tests.length) {
		console.log('running', tests.length, 'tests affected by latest changes');
		// runUnitTests(tests);
	}
}

function showAffected(options) {
	options = options || {};
	git.repoRoot(function (folder) {
		check.verify.string(folder, 'missing repo root folder');
		git.changedFiles(folder, function (files) {
			showAffectedTests(files, options.output, options.run);
		});
	});
}

exports.showAffected = showAffected;
