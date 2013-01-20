function foo() {
	return 'foo';
}

function notCalled() {
	return 'this function is never called';
}

exports.foo = foo;