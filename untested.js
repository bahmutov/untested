#!/usr/bin/env node

var util = require('util');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var addTestPoint = require('./src/addTestPoint').addTestPoint;
var dataStore = require('./src/dataStore');

if (!module.parent) {
	var commandLineOptions = require('./src/options').run();
	console.assert(commandLineOptions, 'could not command line options');
	run(commandLineOptions);
}

function showAffectedTests(filenames, outputFilename) {
	console.assert(Array.isArray(filenames), 'expected source files to be an array');
	console.log('computing list of tests affected by changes in\n', filenames);
	var tests = dataStore.findAffected(filenames);
	console.assert(Array.isArray(tests), 'tests should be an array, not', tests);
	var info = JSON.stringify(tests, null, 2);
	if (outputFilename) {
		fs.writeFileSync(outputFilename, info, 'utf-8');
		console.log('saved', tests.length, 'affected tests names to', outputFilename);
	} else {
		console.log(info);
	}
}

function getGitDiffFiles(cb) {
	console.assert(typeof cb === 'function', 'expect callback function, not', cb);
	var diff = spawn('git', ['diff', '--name-only']);
	var files = [];

	diff.stdout.setEncoding('utf-8');
	diff.stdout.on('data', function (data) {
		data.trim();
		files = data.split('\n');
		files = files.filter(function (filename) {
			return filename.length;
		});
		files = files.map(function (filename) {
			return path.resolve(filename);
		});
	});

	diff.stderr.setEncoding('utf-8');
	diff.stderr.on('data', function (data) {
		console.log('git diff error: ' + data);
	});

	diff.on('exit', function (code) {
		cb(files);
	});
}

function run(options) {
	options = options || {};

	if (options.info) {
		dataStore.showInfo();
		process.exit(0);
	}

	if (options.reset) {
		dataStore.reset();
		process.exit(0);
	}

	if (options.git) {
		getGitDiffFiles(function (files) {
			showAffectedTests(files, options.output);	
		});
	} else if (options.test && options.coverage) {
		addTestPoint(options);
	} else if (options.affected) {
		showAffectedTests(options.affected, options.output);
	}
}

exports.run = run;
exports.info = dataStore.showInfo;
exports.reset = dataStore.reset;
exports.update = addTestPoint;