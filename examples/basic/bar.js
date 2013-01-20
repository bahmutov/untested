var foo = require('./foo').foo;

function bar() {
	return foo() + '_bar';
}

exports.bar = bar;