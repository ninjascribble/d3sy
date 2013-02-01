;(function() {
	"use strict";

	var _root = $('pre')
	  , _data = XYZ.model
	  , _btn = $('button').bind('click', function() {
	  	XYZ.step();
	  	_root.text(JSON.stringify(XYZ.model, 0, 2));
	  });

	for (var i = 0; i < 24 * 365; i++) {
		XYZ.step();
	}
	
	setInterval(localStep, 300);

	function localStep() {
		XYZ.step();
		_root.text(JSON.stringify(XYZ.model, 0, 2));
	}
}());