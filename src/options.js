var optimist = require("optimist");
var package = require('../package.json');
var path = require('path');

function getArguments() {
	var args = optimist.usage(package.name + ' version ' + package.version + 
		' by ' + package.author + '\n' +	package.description + '\n' + 'Usage: $0')
	.default({
		help: false,
		version: false,
		test: '',
		coverage: ''
	})
	.alias('h', 'help').boolean('help').describe('help', 'show help message and exit')
	.alias('v', 'version').boolean('version').describe('version', 'show version and exit')
	.string('test').describe('test', 'test point url / filename')
	.string('coverage').alias('c', 'coverage').alias('cover', 'coverage')
	.describe('coverage', 'coverage json filename')
	.argv;
	return args;
};

function formArguments() {
	var args = getArguments();
	console.assert(args, 'could not get command line arguments');

	if (args.h || args.help) {
		wrongArguments(args);
	}
	if (args.v || args.version) {
		console.log(package.version);
		process.exit(0);
	}
	if (!args.test) {
		wrongArguments(args, 'missing test filename');
	}
	args.test = path.resolve(args.test);

	if (!args.coverage) {
		wrongArguments(args, 'missing coverage filename');
	}
	args.coverage = path.resolve(args.coverage);

	return args;
}

function wrongArguments(options, message) {
	options = options || {};
	optimist.showHelp();
	console.log('current arguments\n', options);

	if (message) {
		console.log('\n' + message);
	}
	process.exit(0);
}

exports.run = formArguments;