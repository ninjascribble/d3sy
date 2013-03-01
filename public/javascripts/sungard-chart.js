;(function() {

var MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
  , DAYS = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ];

// Build the DOM
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');

var _selector = d3.select('body').append('select').attr('id', 'revenue-selector')
  , _stage = d3.select('body').append('svg').attr('id', 'revenue').attr('height', 800)
  , _bars = _stage.append('g').attr('id','bar-group')
  , _lines = _stage.append('g').attr('id','line-group')
  , _netLine = _lines.append('path').attr('id','net-line')
  , _grossLine = _lines.append('path').attr('id','gross-line')
  , _data = {

    monthly: [
      { time: new Date('1/31/2012'),  gross: 5000, net: 4500 },
      { time: new Date('2/28/2012'),  gross:  5500, net: 4900 },
      { time: new Date('3/31/2012'),  gross:  5700, net: 5300 },
      { time: new Date('4/30/2012'),  gross:  6500, net: 5800 },
      { time: new Date('5/31/2012'),  gross:  7800, net: 6500 },
      { time: new Date('6/30/2012'),  gross:  7900, net: 6600 },
      { time: new Date('7/31/2012'),  gross:  9500, net: 7000 },
      { time: new Date('8/31/2012'),  gross:  10000, net: 7500 },
      { time: new Date('9/30/2012'),  gross:  12000, net: 9000 },
      { time: new Date('10/31/2012'), gross:  12500, net: 9500 },
      { time: new Date('11/30/2012'), gross:  20000, net: 15000 },
      { time: new Date('12/31/2012'), gross: 22000, net: 17000 }
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
  renderNetLine(data, range);
  renderGrossLine(data, range);
  renderLabel(data, range);
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

  var selected = _bars.selectAll('rect.net').data(data, function(d) { return d.time.toUTCString(); })
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , fn = {
      x: function(d, i) { return i * barWidth * 2 + barWidth / 4 },
      y: function(d, i) { return floor - range(d.net); },
      h: function(d, i) { return range(d.net); },
      w: barWidth / 2
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

  var selected = _bars.selectAll('rect.gross').data(data, function(d) { return d.time.toUTCString(); })
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , fn = {
      x: function(d, i) { return i * barWidth * 2 + barWidth / 4 + barWidth / 2 },
      y: function(d, i) { return floor - range(d.gross); },
      h: function(d, i) { return range(d.gross); },
      w: barWidth / 2
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

  var selected = _bars.selectAll('text.label').data(data, function(d) { return d.time.toUTCString(); })
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

function renderNetLine(data, range) {

  var selected = _netLine
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , line = d3.svg.line().interpolate('basis')
      .x(function(d, i) { return i * barWidth * 2 + barWidth / 2})
      .y(function(d, i) { return floor - range(d.net); });

      selected.attr('d', line(data))
}

function renderGrossLine(data, range) {

  var selected = _grossLine
    , floor = parseInt(_stage.style('height')) - margin
    , barWidth = Math.ceil( (parseInt(_stage.style('width'))) / (data.length * 2) )
    , line = d3.svg.line().interpolate('basis')
      .x(function(d, i) { return i * barWidth * 2 + (barWidth)})
      .y(function(d, i) { return floor - range(d.gross); });

      selected.attr('d', line(data))
}

}());