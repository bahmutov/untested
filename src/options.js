var optimist = require('optimist');
var package = require('../package.json');
var path = require('path');

function getArguments() {
	var args = optimist.usage(package.name + ' version ' + package.version +
		' by ' + package.author + '\n' +	package.description + '\n' + 'Usage: $0')
	.default({
		help: false,
		version: false,
		test: '',
		coverage: '',
		info: false,
		reset: false,
		affected: [],
		output: '',
		git: false,
		run: false
	})
	.alias('h', 'help').boolean('help').describe('help', 'show help message and exit')
	.alias('v', 'version').boolean('version').describe('version', 'show version and exit')
	.string('test').alias('t', 'test')
	.describe('test', 'test point url / filename. Returns info for given test if no coverage is given.')
	.string('coverage').alias('c', 'coverage').alias('cover', 'coverage')
	.describe('coverage', 'coverage json filename')
	.boolean('info').alias('i', 'info').describe('info', 'show current test points in DB')
	.boolean('reset').describe('reset', 'delete all existing info')
	.string('affected').alias('a', 'affected')
	.describe('affected', 'find tests affected by changes in this source file, can be specified multiple times')
	.string('output').alias('o', 'output')
	.describe('output', 'output filename for test list')
	.boolean('git').describe('git', 'check current git repo for changes, compute tests')
	.boolean('run').alias('r', 'run').describe('run tests found to be affected')
	.argv;
	return args;
}

function formArguments() {
	var args = getArguments();
	console.assert(args, 'could not get command line arguments');

	if (args.h || args.help) {
		wrongArguments(args);
	}

	if (args.v || args.version) {
		console.log(package.name, 'by', package.author, 'version', package.version);
		process.exit(0);
	}
	if (args.info || args.reset || args.git) {
		return args;
	}

	if (typeof args.affected === 'string') {
		args.affected = [args.affected];
	}
	args.affected = args.affected.map(function (filename) {
		return path.resolve(filename);
	});
	if (args.affected.length > 0) {
		return args;
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
