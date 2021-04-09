const { throws, deepEqual } = require('assert');

const mod = require('./main.js');

describe('OLSKHashString', function test_OLSKHashString() {

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKHashString(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mod.OLSKHashString({}), '');
	});

	it('converts properties', function () {
		const item = {
			[Math.random().toString()]: Math.random().toString(),
			[Math.random().toString()]: Math.random().toString(),
		};
		deepEqual(mod.OLSKHashString(item), Object.entries(item).map(function (e) {
			return e.join('=');
		}).join('&'));
	});

});

describe('OLSKHashObject', function test_OLSKHashObject() {

	it('throws if not string', function () {
		throws(function () {
			mod.OLSKHashObject(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mod.OLSKHashObject(''), {});
	});

	it('converts properties', function () {
		const item = {
			[Math.random().toString()]: Math.random().toString(),
			[Math.random().toString()]: Math.random().toString(),
		};
		deepEqual(mod.OLSKHashObject(mod.OLSKHashString(item)), item);
	});

	it('ignores prefix', function () {
		const item = {
			[Math.random().toString()]: Math.random().toString(),
		};
		deepEqual(mod.OLSKHashObject(''.padStart(Math.max(2, uRandomInt(10)), '#') + mod.OLSKHashString(item)), item);
	});

});

describe('OLSKHashSetup', function test_OLSKHashSetup() {

	const _OLSKHashSetup = function (inputData = {}, debug = {}) {
		return mod.OLSKHashSetup(Object.assign({
			OLSKHashDispatchInitialize: (function () {}),
			OLSKHashDispatchChange: (function () {}),
		}, inputData), Object.assign({
			window: Object.assign({
				addEventListener: (function () {}),
				location: Object.assign({
					hash: '',
				}, debug),
			}, debug),
		}, debug));
	};

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKHashSetup(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if OLSKHashDispatchInitialize not function', function () {
		throws(function () {
			_OLSKHashSetup({
				OLSKHashDispatchInitialize: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if OLSKHashDispatchChange not function', function () {
		throws(function () {
			_OLSKHashSetup({
				OLSKHashDispatchChange: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('sends OLSKHashDispatchInitialize if no hash', function () {
		deepEqual(uCapture(function (OLSKHashDispatchInitialize) {
			_OLSKHashSetup({
				OLSKHashDispatchInitialize,
			});
		}), [{}]);
	});

	it('sends OLSKHashDispatchInitialize if hash', function () {
		const item = {
			[Math.random().toString()]: Math.random().toString(),
		};
		deepEqual(uCapture(function (OLSKHashDispatchInitialize) {
			_OLSKHashSetup({
				OLSKHashDispatchInitialize,
			}, {
				hash: mod.OLSKHashString(item),
			});
		}), [item]);
	});

	it('sends OLSKHashDispatchChange on hashchange', function () {
		const flag = uRandomElement(true, false);
		const item = Math.random().toString();
		deepEqual(_OLSKHashSetup({
			OLSKHashDispatchChange: (function () {
				return item;
			}),
		}, {
			addEventListener: (function (param1, param2) {
				if (flag) {
					return param2();
				}
			}),
		}), flag ? item : undefined);
	});

});
