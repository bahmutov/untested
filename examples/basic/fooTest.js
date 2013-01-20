var foo = require('./foo').foo;

gt.module('foo test');

gt.test('foo', function () {
	gt.equal(typeof foo, 'function', 'foo is a function');
	gt.equal(foo(), 'foo', 'returns foo');
});