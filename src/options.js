var optimist = require("optimist");
var package = require('../package.json');

function getArguments() {
	var args = optimist.usage(package.name + ' version ' + package.version + 
		' by ' + package.author + '\n' +	package.description + '\n' + 'Usage: $0')
	.default({
		help: false,
		version: false
	})
	.alias('h', 'help').boolean('help').describe('help', 'show help message and exit')
	.alias('v', 'version').boolean('version').describe('version', 'show version and exit')
	.argv;
	return args;
};

function formArguments() {
	var args = getArguments();
	console.assert(args, 'could not get command line arguments');

	if (args.h || args.help) {
		optimist.showHelp();
		console.log('current arguments\n', args);
		process.exit(0);
	}
	if (args.v || args.version) {
		console.log(package.version);
		process.exit(0);
	}

	return args;
}

exports.run = formArguments;