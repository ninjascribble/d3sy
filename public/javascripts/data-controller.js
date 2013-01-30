;(function() {
	"use strict";

	var _root = $('pre')
	  , _data = XYZ.model;

	for (var i = 0; i < 24 * 365; i++) {
		XYZ.step();
	}

	_root.text(JSON.stringify(XYZ.model, 0, 2));
	setInterval(function() {
		XYZ.step();
		_root.text(JSON.stringify(XYZ.model, 0, 2));
	}, 100);

	// ----------------------------------

	var _data = {

		sales: {

			hourly: [
				{ date: new Date('1/1/2012 0:00'), value: 101 },
				{ date: new Date('1/1/2012 1:00'), value: 101 },
				{ date: new Date('1/1/2012 2:00'), value: 101 },
				{ date: new Date('1/1/2012 3:00'), value: 101 },
				{ date: new Date('1/1/2012 4:00'), value: 101 },
				{ date: new Date('1/1/2012 5:00'), value: 101 },
				{ date: new Date('1/1/2012 6:00'), value: 101 },
				{ date: new Date('1/1/2012 7:00'), value: 101 },
				{ date: new Date('1/1/2012 8:00'), value: 101 },
				{ date: new Date('1/1/2012 9:00'), value: 101 },
				{ date: new Date('1/1/2012 10:00'), value: 101 },
				{ date: new Date('1/1/2012 11:00'), value: 101 },
				{ date: new Date('1/1/2012 12:00'), value: 101 },
				{ date: new Date('1/1/2012 13:00'), value: 101 },
				{ date: new Date('1/1/2012 14:00'), value: 101 },
				{ date: new Date('1/1/2012 15:00'), value: 101 },
				{ date: new Date('1/1/2012 16:00'), value: 101 },
				{ date: new Date('1/1/2012 17:00'), value: 101 },
				{ date: new Date('1/1/2012 18:00'), value: 101 },
				{ date: new Date('1/1/2012 19:00'), value: 101 },
				{ date: new Date('1/1/2012 20:00'), value: 101 },
				{ date: new Date('1/1/2012 21:00'), value: 101 },
				{ date: new Date('1/1/2012 22:00'), value: 101 },
				{ date: new Date('1/1/2012 23:00'), value: 101 },
			],

			daily: [
				{ date: new Date('1/1/2012 0:00'), value: 2424 }
			],

			weekly: [
				{ date: new Date('1/1/2012 0:00'), value: 2424 }
			],

			monthly: [
				{ date: new Date('1/1/2012 0:00'), value: 2424 }
			]
		}
	}

}());