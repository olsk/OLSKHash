const mod = {

	OLSKHashString (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return Object.entries(inputData).map(function (e) {
			return e.join('=');
		}).join('&');
	},

	OLSKHashObject (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return Object.fromEntries((new URLSearchParams(inputData.replace(/^#+/, ''))).entries());
	},

	OLSKHashSetup (params, debug = {}) {
		if (typeof params !== 'object' || params === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.OLSKHashDispatchInitialize !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.OLSKHashDispatchChange !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		params.OLSKHashDispatchInitialize(mod.OLSKHashObject((debug.window || window).location.hash));

		return (debug.window || window).addEventListener('hashchange', params.OLSKHashDispatchChange, false);
	},

};

Object.assign(exports, mod);
