;(function() {

var MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];

// Title
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');
d3.select('body').append('svg').attr('id', 'revenue').attr('height', 200);
d3.select('#revenue').append('g');
d3.select('#revenue').append('path');

var _stage = d3.select('#revenue')
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
  	]
  };

update();
// setTimeout(update, _duration);

function update() {

	var data = _data.monthly;

	var sets = _graph.selectAll('g').data(data)
	  , margin = 0
	  , max = 1500000
	  , sw = parseInt(_stage.style('width'))
	  , sh = parseInt(_stage.style('height'))
	  , rw = Math.ceil( (sw - margin) / (data.length * 2) )

	  , x = function(d, i) { return i * rw * 2 + rw / 4 }
	  , textx = function(d, i) { return x(d, i) + rw / 2 }
	  , h = function(d, i) { return sh * d.actual / max - 20 }
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
	  	.y( function(d, i) { return sh - (sh * d.projected / max) } );

	_line.attr('d', line(data))
}

}());