var spawn = require('child_process').spawn;
var path = require('path');

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

exports.diff = getGitDiffFiles;