;(function() {

var MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];

// Title
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');
d3.select('body').append('select').attr('id', 'revenue-selector');
d3.select('body').append('svg').attr('id', 'revenue').attr('height', 200);
d3.select('#revenue').append('g');
d3.select('#revenue').append('path');

var _stage = d3.select('#revenue')
  , _selector = d3.select('#revenue-selector')
  , _line = d3.select('#revenue > path')
  , _graph = d3.select('#revenue > g')
  , _duration = 800
  , _data = {

  	monthly: [
  		{ time: new Date('1/1/2012'),  actual: 1100000, projected: 880000 },
  		{ time: new Date('2/1/2012'),  actual:  772000, projected: 680000 },
  		{ time: new Date('3/1/2012'),  actual:  805000, projected: 710000 },
  		{ time: new Date('4/1/2012'),  actual:  727000, projected: 670000 },
  		{ time: new Date('5/1/2012'),  actual:  731000, projected: 641000 },
  		{ time: new Date('6/1/2012'),  actual:  728000, projected: 680000 },
  		{ time: new Date('7/1/2012'),  actual:  858000, projected: 790000 },
  		{ time: new Date('8/1/2012'),  actual:  864000, projected: 740000 },
  		{ time: new Date('9/1/2012'),  actual:  716000, projected: 670000 },
  		{ time: new Date('10/1/2012'), actual:  719000, projected: 675000 },
  		{ time: new Date('11/1/2012'), actual:  979000, projected: 812000 },
  		{ time: new Date('12/1/2012'), actual: 1300000, projected: 980000 }
  	],

  	daily: [
  		{ time: new Date('1/1/2012'), actual: 35483, projected: 34232 },
  		{ time: new Date('1/2/2012'), actual: 32433, projected: 31252 },
  		{ time: new Date('1/3/2012'), actual: 33421, projected: 32552 },
  		{ time: new Date('1/4/2012'), actual: 33823, projected: 30124 },
  		{ time: new Date('1/5/2012'), actual: 31234, projected: 30021 },
  		{ time: new Date('1/6/2012'), actual: 30234, projected: 28412 },
  		{ time: new Date('1/7/2012'), actual: 34214, projected: 32413 }
  	]
  };

update('monthly');

function update(str) {

	var data = _data[str];

	var sets = _graph.selectAll('g').data(data)
	  , margin = 0
	  , max = d3.max(data.map(function(o,i) { return o.actual; }))
	  , sw = parseInt(_stage.style('width'))
	  , sh = parseInt(_stage.style('height'))
	  , rw = Math.ceil( (sw - margin) / (data.length * 2) )

	  , x = function(d, i) { return i * rw * 2 + rw / 4 }
	  , textx = function(d, i) { return x(d, i) + rw / 2 }
	  , h = function(d, i) { return sh * d.actual / max - 30 }
	  , y = function(d, i) { return sh - h(d, i) - 20 };

	var enteringGroup = sets.enter().insert('g');

	enteringGroup.insert('rect')
		.attr('y', sh - 20)
		.attr('x', x)
		.attr('width', rw)
		.transition()
			.duration(_duration)
			.attr('y', y)
			.attr('height', h);

	enteringGroup.insert('text')
		.attr('y', sh - 5)
		.attr('x', textx)
		.attr('width', rw)
		.text(function(d, i) { return MONTHS[d.time.getMonth()] });

	var line = d3.svg.line()
	  	.x(textx)
	  	.y( function(d, i) { return sh - (sh * d.projected / max - 20) } );

	_line.attr('d', line(data))
}

}());