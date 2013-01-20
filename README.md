untested
========

Orders tests for a source code change based on code coverage analysis.

Idea
----

Example JavaScript source organization:
	
	foo.js
	bar.js // uses foo.js

	tests/
		fooTest.js // tests foo.js
		barTest.js // tests bar.js

You have edited *foo.js* and rerun *tests/fooTest.js*. Are you done? No. Do you know which tests are somehow affected by *foo.js*? What if you have 100s of JavaScript source files and 100s of unit tests. Testing everything on every commit would take hours ...

**untested** is the solution. 

1. Run a unit test using [*gt*](https://github.com/bahmutov/gt) or [*lasso-node*](https://github.com/bahmutov/lasso-node) or [*solid-code*](https://github.com/bahmutov/solid-code), and you get code coverage results.
2. Throw these results into **untested**. 
3. On a commit give the changelist to **untested** and get back ordered list of tests affected.
4. Run these tests first. Get the results right away.

Installation
------------

You need nodejs installed, you probably need one of my other testing tools, 
like [*gt*](https://github.com/bahmutov/gt) or [*lasso-node*](https://github.com/bahmutov/lasso-node).

	npm install -g untested

Usage
-----

From *examples/basic* folder
	
	gt fooTest.js
	untested --test fooTest.js --coverage coverage.json

	gt barTest.js
	untested --test fooTest.js --coverage coverage.json

	untested --affected foo.js // returns both fooTest.js and barTest.js

License
-------
MIT style license, see file.

Author
------
Contact Gleb Bahmutov gleb.bahmutov@gmail.com with any questions, etc.