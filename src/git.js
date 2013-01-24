var spawn = require('child_process').spawn;
var path = require('path');

function getTopFolder(cb) {
	console.assert(typeof cb === 'function', 'expect callback function, not', cb);
	var git = spawn('git', ['rev-parse', '--show-toplevel']);
	var topLevelFolder = null;

	git.stdout.setEncoding('utf-8');
	git.stdout.on('data', function (data) {
		data.trim();
		if (/fatal/.test(data)) {
			throw new Error('Could not determine git top folder\n' + data);
		}
		topLevelFolder = data;
		topLevelFolder.trim();
	});

	git.stderr.setEncoding('utf-8');
	git.stderr.on('data', function (data) {
		throw new Error('Could not determine git top folder\n' + data);
	});

	git.on('exit', function (code) {
		cb(topLevelFolder);
	});
}

function getGitDiffFiles(repoTopFolder, cb) {
	console.assert(typeof repoTopFolder === 'string', 'expected git top folder');
	console.assert(typeof cb === 'function', 'expect callback function, not', cb);
	repoTopFolder = repoTopFolder.trim();

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
			return path.join(repoTopFolder, filename);
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

exports.diff = getGitDiffFiles;
exports.getTopFolder = getTopFolder;