;(function() {

var MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
  , DAYS = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ];

// Build the DOM
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');

var _stage = d3.select('body').append('svg').attr('id', 'revenue').attr('height', 200)
  , _selector = d3.select('body').append('select').attr('id', 'revenue-selector')
  , _data = {

  	monthly: [
  		{ time: new Date('1/31/2012'),  gross: 1100000, net: 980000 },
  		{ time: new Date('2/28/2012'),  gross:  772000, net: 680000 },
  		{ time: new Date('3/31/2012'),  gross:  805000, net: 710000 },
  		{ time: new Date('4/30/2012'),  gross:  727000, net: 670000 },
  		{ time: new Date('5/31/2012'),  gross:  731000, net: 641000 },
  		{ time: new Date('6/30/2012'),  gross:  728000, net: 680000 },
  		{ time: new Date('7/31/2012'),  gross:  858000, net: 790000 },
  		{ time: new Date('8/31/2012'),  gross:  864000, net: 740000 },
  		{ time: new Date('9/30/2012'),  gross:  716000, net: 670000 },
  		{ time: new Date('10/31/2012'), gross:  719000, net: 675000 },
  		{ time: new Date('11/30/2012'), gross:  979000, net: 812000 },
  		{ time: new Date('12/31/2012'), gross: 1300000, net: 980000 }
  	],

  	daily: [
  		{ time: new Date('1/1/2012'), gross: 35483, net: 34232 },
  		{ time: new Date('1/2/2012'), gross: 32433, net: 31252 },
  		{ time: new Date('1/3/2012'), gross: 33421, net: 32552 },
  		{ time: new Date('1/4/2012'), gross: 33823, net: 30124 },
  		{ time: new Date('1/5/2012'), gross: 31234, net: 30021 },
  		{ time: new Date('1/6/2012'), gross: 30234, net: 28412 },
  		{ time: new Date('1/7/2012'), gross: 34214, net: 32413 }
  	]
  };

// Configure the data selector
for (var key in _data) {
	_selector.append('option').attr('value', key).text(key);
}

_selector.on('change', function() {
	update(this.value)
});

// Stash the moving parts of the chart
var margin = 20
  , duration = 300
  , formatters = {
    monthly: d3.time.format('%b'),
    daily: d3.time.format('%a'),
    currency: d3.format('s')
  };

update('monthly');

function update(type) {

	var data = _data[type]
    , range = getRange(data);

  switch(type) {
    case 'daily':
      formatters.date = formatters.daily;
      break;
    case 'monthly':
    default:
      formatters.date = formatters.monthly;
      break;
  }

  renderNet(data, range);
  renderGross(data, range);
  renderLabel(data, range);
  renderTotal(data, range);
}

function getRange(data) {

  var combinedData = []
    , i = 0
    , len = data.length
    , result;

  for (i; i < len; i++) {
    combinedData.push(data[i].gross);
  }

  result = d3.scale.linear()
                .domain([0, d3.max(combinedData)])
                .range([margin * 2, parseInt(_stage.style('height')) - margin * 4]);

  return result;
}

function renderNet(data, range) {

  var selected = _stage.selectAll('rect.net').data(data, function(d) { return d.time.toUTCString(); })
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , fn = {
      x: function(d, i) { return i * barWidth * 2 + barWidth / 4 },
      y: function(d, i) { return floor - range(d.net); },
      h: function(d, i) { return range(d.net); },
      w: barWidth
    };

  selected.enter().insert('rect')
    .attr('class', 'net q0-11')
    .attr('x', fn.x)
    .attr('y', floor)
    .attr('height', 0)
    .attr('width', fn.w);

  selected.transition()
    .delay(duration)
    .duration(duration)
      .attr('x', fn.x)
      .attr('y', fn.y)
      .attr('height', fn.h)
      .attr('width', fn.w);

  selected.exit().transition()
    .duration(duration)
    .attr('y', floor)
    .attr('height', 0)
    .remove();
}

function renderGross(data, range) {

  var selected = _stage.selectAll('rect.gross').data(data, function(d) { return d.time.toUTCString(); })
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , fn = {
      x: function(d, i) { return i * barWidth * 2 + barWidth / 4 },
      y: function(d, i) { return floor - range(d.net) - range(d.gross - d.net); },
      h: function(d, i) { return range(d.gross - d.net); },
      w: barWidth
    };

  selected.enter().insert('rect')
    .attr('class', 'gross q2-11')
    .attr('x', fn.x)
    .attr('y', floor)
    .attr('height', 0)
    .attr('width', fn.w)

  selected.transition()
    .delay(duration)
    .duration(duration)
      .attr('x', fn.x)
      .attr('y', fn.y)
      .attr('height', fn.h)
      .attr('width', fn.w);

  selected.exit().transition()
    .duration(duration)
    .attr('y', floor)
    .attr('height', 0)
    .remove();
}

function renderLabel(data, range) {

  var selected = _stage.selectAll('text.label').data(data, function(d) { return d.time.toUTCString(); })
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , fn = {
      x: function(d, i) { return i * barWidth * 2 + barWidth * .75; },
      y: function(d, i) { return floor + parseInt(this.clientHeight); },
      text: function(d, i) { return formatters.date(d.time).toUpperCase(); }
    };

  selected.enter().insert('text')
    .attr('class', 'label')
    .text(fn.text)
    .attr('x', fn.x)
    .attr('y', fn.y)
    .attr('fill-opacity', 0);

  selected.transition()
    .delay(duration)
    .duration(duration)
    .attr('fill-opacity', 1);

  selected.exit().transition()
    .duration(duration)
    .attr('fill-opacity', 0)
    .remove();
}

function renderTotal(data, range) {

  var selected = _stage.selectAll('text.total').data(data, function(d) { return d.time.toUTCString(); })
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , fn = {
      x: function(d, i) { return i * barWidth * 2 + barWidth * .75; },
      y: function(d, i) { return floor - range(d.net) - range(d.gross - d.net) - parseInt(this.clientHeight) / 2; },
      text: function(d, i) { return '$' + formatters.currency(d.gross); }
    };

  selected.enter().insert('text')
    .attr('class', 'total')
    .text(fn.text)
    .attr('x', fn.x)
    .attr('y', fn.y)
    .attr('fill-opacity', 0);

  selected.transition()
    .delay(duration)
    .duration(duration)
    .attr('fill-opacity', 1);

  selected.exit().transition()
    .duration(duration)
    .attr('fill-opacity', 0)
    .remove();
}

}());