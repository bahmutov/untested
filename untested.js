#!/usr/bin/env node

var util = require('util');
var path = require('path');
var fs = require('fs');

var addTestPoint = require('./src/addTestPoint').addTestPoint;
var dataStore = require('./src/dataStore');
var runUnitTests = require('./src/runTests').run;
var showAffectedFiles = require('./src/affectedFiles').showAffected;

if (!module.parent) {
	var commandLineOptions = require('./src/options').run();
	console.assert(commandLineOptions, 'could not command line options');
	run(commandLineOptions);
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
		showAffectedFiles({
			output: options.output,
			run: options.run
		});
	} else if (options.test && options.coverage) {
		addTestPoint(options);
	} else if (options.affected) {
		showAffectedTests(options.affected, options.output, options.run);
	}
}

function coveredPercent(fileLineInfo) {
  var lines = Object.keys(fileLineInfo);

  var covered = 0;
  var total = 0;

  lines.forEach(function(line) {
      var timesCovered = fileLineInfo[line];
      console.assert(timesCovered >= 0, "invalid number of times covered", timesCovered);
      covered += (timesCovered > 0 ? 1 : 0);
      total += 1;
  });

  console.assert(!isNaN(covered), 'number of covered lines', covered, 'is not a number');
  console.assert(!isNaN(total), 'total lines', total, 'is not a number');
  if (total < 1) {
      return 100.0;
  } else {
      return Math.round(covered / total * 100);
  }
}

function getCoverageSummary(istanbulCoverageReport) {
	var coverageReport = {};

  Object.keys(istanbulCoverageReport).forEach(function(filename) {
      var fileInfo = istanbulCoverageReport[filename];
      var covered = coveredPercent(fileInfo.l);
      console.assert(covered >= 0.0 && covered <= 100.0, 
      	"invalid coverage % " + covered + " for file " + filename);

      // console.log(filename, covered + '%');
      coverageReport[filename] = {
          name: filename,
          coverage: covered
      };
  });
  return coverageReport;
}

exports.run = run;
exports.info = dataStore.showInfo;
exports.reset = dataStore.reset;
exports.update = addTestPoint;
exports.getCoverageSummary = getCoverageSummary;