function foo() {
	return 'foo';
}

function foo2() {
	return 'foo2';
}

function notCalled() {
	return 'this function is never called';
}

exports.foo = foo;
exports.foo2 = foo2;