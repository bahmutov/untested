var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function getUserHome() {
	var win32 = (process.platform === 'win32');
	return process.env[win32 ? 'USERPROFILE' : 'HOME'];
}

var filename = path.join(getUserHome(), 'testPoints.json');
var tab = ' '; // console.log adds extra space

function loadExistingTestPoints() {
	var data = {};
	if (fs.existsSync(filename)) {
		data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
		// console.log('loaded data from', filename);
	} else {
		console.log('starting new data store');
	}
	return data;
}

function saveDataStore(data) {
	console.log('saving data store to', filename);

	data = data || {};
	fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
	// console.log(util.inspect(data, true, 2));
	console.log('saved test info data into', filename);
}

function showInfo() {
	var data = loadExistingTestPoints();
	console.assert(data, 'could not load data');

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

function findAffected(sourceFiles) {
	console.assert(Array.isArray(sourceFiles), 'expect list of filenames');
	if (!sourceFiles.length) {
		console.log('empty list of source files, nothing affected');
		return [];
	}
	sourceFiles = sourceFiles.map(function (filename) {
		return filename.toLowerCase();
	});

	var tests = [];
	var data = loadExistingTestPoints();
	console.assert(data, 'could not load data');

	var coveredSourceFiles = [];
	Object.keys(data).forEach(function (testName) {
		var coverage = data[testName];
		Object.keys(coverage).forEach(function (coveredName) {
			var covered = coverage[coveredName];
			var found = sourceFiles.some(function (sourceFile) {
				return (covered.name.toLowerCase() === sourceFile);
			});
			if (found) {
				console.log('test', testName, 'covers', covered.name, 'at', covered.coverage + '%');
				tests.push({
					name: testName,
					coverage: covered.coverage
				});
				coveredSourceFiles.push(covered.name);
			}
		});
	});
	coveredSourceFiles = _.uniq(coveredSourceFiles);
	coveredSourceFiles = coveredSourceFiles.map(function (filename) {
		return filename.toLowerCase();
	});

	var notCoveredSourceFiles = _.difference(sourceFiles, coveredSourceFiles);
	if (notCoveredSourceFiles.length) {
		console.log('Could not find tests for following source files');
		notCoveredSourceFiles.forEach(function (filename) {
			console.log(filename);
		});
	}
	return tests;
}

function findSortedAffected(sourceFiles) {
	console.assert(Array.isArray(sourceFiles), 'expect list of filenames');
	var tests = findAffected(sourceFiles);
	console.assert(Array.isArray(tests), 'could not get back array of tests');

	tests = _.sortBy(tests, 'coverage').reverse();
	return tests;
}

function findUniqueAffected(sourceFiles) {
	console.assert(Array.isArray(sourceFiles), 'expect list of filenames');
	var tests = findSortedAffected(sourceFiles);
	console.assert(Array.isArray(tests), 'could not get back array of tests');

	tests = _.uniq(tests, false, function (test) {
		return test.name;
	});
	return tests;
}

exports.loadExistingTestPoints = loadExistingTestPoints;
exports.saveDataStore = saveDataStore;
exports.showInfo = showInfo;
exports.reset = reset;
exports.findAffected = findUniqueAffected;
