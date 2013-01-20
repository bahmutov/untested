var foo = require('./foo').foo;
var foo2 = require('./foo').foo2;

gt.module('foo test');

gt.test('foo', function () {
	gt.equal(typeof foo, 'function', 'foo is a function');
	gt.equal(foo(), 'foo', 'returns foo');
});

gt.test('foo2', function () {
	gt.equal(typeof foo2, 'function', 'foo2 is a function');
	gt.equal(foo2(), 'foo2', 'returns foo2');
});