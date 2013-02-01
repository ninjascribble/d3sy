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
	
}());