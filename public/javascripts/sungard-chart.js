;(function() {

var MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
  , DAYS = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ]
  , COLORS = ['#1A6600','#004000','#B2CBD4','#042200'];

// Build the DOM
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');

var _selector = d3.select('body').append('select').attr('id', 'planning-selector')
  , _stage = d3.select('body').append('svg').attr('id', 'planning').attr('height', 800)
  , data = [
      { time: new Date('1/31/2012'),  data: { net: 4500, gross: 5000 }},
      { time: new Date('2/28/2012'),  data: { net: 4900, gross:  5500 }},
      { time: new Date('3/31/2012'),  data: { net: 5300, gross:  5700 }},
      { time: new Date('4/30/2012'),  data: { net: 5800, gross:  6500 }},
      { time: new Date('5/31/2012'),  data: { net: 6500, gross:  7800 }},
      { time: new Date('6/30/2012'),  data: { net: 6600, gross:  7900 }},
      { time: new Date('7/31/2012'),  data: { net: 7000, gross:  9500 }},
      { time: new Date('8/31/2012'),  data: { net: 7500, gross:  10000 }},
      { time: new Date('9/30/2012'),  data: { net: 9000, gross:  12000 }},
      { time: new Date('10/31/2012'), data: { net: 9500, gross:  12500 }},
      { time: new Date('11/30/2012'), data: { net: 15000, gross:  20000 }},
      { time: new Date('12/31/2012'), data: { net: 17000, gross: 22000 }}
    ];

var margin = 20
  , duration = 300
  , formatters = {
    monthly: d3.time.format('%b'),
    daily: d3.time.format('%a'),
    currency: d3.format('s')
  }
  , range
  , space = {
      width: parseInt(_stage.style('width')),
      height: parseInt(_stage.style('height')),
      margin: 0
    };

// Configure the data selector
// for (var key in _data) {
//   _selector.append('option').attr('value', key).text(key);
// }

// _selector.on('change', function() {
//   update(this.value)
// });

// Stash the moving parts of the chart



//renderValues();

_render();

var _bars, _lines, _values, _netLine, _grossLine, _barWidth, _data, _range;

function _render() {
  _bars = _stage.append('g').attr('id','bar-group');
  _lines = _stage.append('g').attr('id','line-group');
  _values = d3.select('body').append('svg').attr('id','planning-values').attr('height', 200)  ;



  update()
}
function _dataPrep(data) {
  var obj = { 
    keyCount: 0, 
    data: {} 
  };
  var innerObj;


  for (var key in data[0].data) {
    obj.data[key] = [];
    obj.keyCount++;
    for (var i = 0; i < data.length; i++) {
      innerObj = {};
      innerObj.time = data[i].time;
      innerObj.value = data[i].data[key]
      obj.data[key].push(innerObj)
    };
  }

  return obj;
}

function update() {

  _data = _dataPrep(data);

  _barWidth = Math.ceil( (space.width) / (data.length * (_data.keyCount+1)));
  _range = getRange(data);

  var idx = 0;

  for (var key in _data.data) {
    _renderBarGraph(_data, key, idx);
    _renderLine(_data, key, idx);
    //_renderKey(_data,key, idx);

    idx++;
  }
}

function getRange(data) {

  var combinedData = []
    , i = 0
    , len = data.length
    , result
    , key;

  for (i; i < len; i++) {
    for (key in data[0].data) {
      combinedData.push(data[i].data[key]);
    }
  }

  result = d3.scale.linear()
                .domain([0, d3.max(combinedData)])
                .range([space.margin * 2, space.height - space.margin * 4]);

  return result;
}

function _renderBarGraph(data, key, idx) {  

  var selected = _bars.selectAll('rect.bar-'+key).data(data.data[key], function(d) { return d.time.toUTCString(); })
    , floor = space.height - space.margin
    , fn = {
      x: function(d, i) {
        // time division + index division
       return (i * _barWidth * (_data.keyCount+1)) + (_barWidth * idx)
      },
      y: function(d, i) { return floor - _range(d.value); },
      h: function(d, i) { return _range(d.value); },
      w: _barWidth
    };

  selected.enter().insert('rect')
    .attr('class', 'bar-'+key)
    .attr('x', fn.x)
    .attr('y', floor)
    .attr('height', 0)
    .attr('width', fn.w)
    .attr('fill', COLORS[idx]);

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

function _renderLine(data, key, idx) {

  var selected = _lines.append('path').attr('id','line-'+key)
    , floor = space.height - space.margin
    , line = d3.svg.line().interpolate('basis')
      .x(function(d, i) { 
        return (i * _barWidth * (_data.keyCount+1)) + (_barWidth * idx) + (_barWidth / 2);
      })
      .y(function(d, i) { return floor - _range(d.value); });

      selected.attr('d', line(data.data[key])).attr('stroke', COLORS[idx+2])
}
function _renderKey(data, key, idx) {
  var selected = _values.append('g').attr('id','keyvalue-'+key)
}

}());