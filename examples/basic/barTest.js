var bar = require('./bar').bar;

gt.module('bar test');

gt.test('bar', function () {
	gt.equal(typeof bar, 'function', 'bar is a function');
	gt.equal(bar(), 'foo_bar', 'returns bar');
});