//;(function() {

var MONTHS = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ]
  , DAYS = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ]
  , COLORS = ['#1A6600','#004000','#B2CBD4','#042200'];

// Build the DOM
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');

var _selector = d3.select('body').append('select').attr('id', 'planning-selector')
  , _stage = d3.select('body').append('svg').attr('id', 'planning').attr('height', 800)
  , data = [
      { time: new Date('1/1/2010'),  data: { afterTaxLiving: 955.24,    gross: 2868.51,  afterTax: 2358.24,  afterTaxLivingHealth: 355.24} },
      { time: new Date('1/1/2015'),  data: { afterTaxLiving: 1546.33,   gross: 3661.03,  afterTax: 3031.88,  afterTaxLivingHealth: 946.33} },
      { time: new Date('1/1/2020'),  data: { afterTaxLiving: 2318.67,   gross: 4672.50,  afterTax: 3891.63,  afterTaxLivingHealth: 1718.67} },
      { time: new Date('1/1/2025'),  data: { afterTaxLiving: 3323.41,   gross: 5963.43,  afterTax: 4988.92,  afterTaxLivingHealth: 2723.41} },
      { time: new Date('1/1/2030'),  data: { afterTaxLiving: 4625.87,   gross: 7611.02,  afterTax: 6389.36,  afterTaxLivingHealth: 4025.87} },
      { time: new Date('1/1/2035'),  data: { afterTaxLiving: 6309.47,   gross: 9713.80,  afterTax: 8176.73,  afterTaxLivingHealth: 5709.47} },
      { time: new Date('1/1/2040'),  data: { afterTaxLiving: 8480.79,   gross: 12397.55, afterTax: 10457.91, afterTaxLivingHealth: 7880.79} },
      { time: new Date('1/1/2045'),  data: { afterTaxLiving: 11275.89,  gross: 15822.76, afterTax: 13369.35, afterTaxLivingHealth: 10675.89} },
      { time: new Date('1/1/2050'),  data: { afterTaxLiving: 14868.52,  gross: 20194.30, afterTax: 17085.15, afterTaxLivingHealth: 14268.53} }
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

  _stage.on('mousemove', _mousemove);


  update()
}
function _dataPrep(data) {
  var theArray = [];

  var displayType, innerObj;

  for (var key in data[0].data) {

    obj = { key: key, data: [] }

    if (key == "afterTaxLiving" || key == "gross")
      obj.displayType = 'bar';

    if (key == "afterTax" || key == "afterTaxLivingHealth")
      obj.displayType = 'line';

    for (var i = 0; i < data.length; i++) {
      innerObj = {};
      innerObj.time = data[i].time;
      innerObj.value = data[i].data[key];      
      obj.data.push(innerObj);
    };

    theArray.push(obj);

  }

  return theArray;
}

function update() {

  _data = _dataPrep(data);

  _barWidth = Math.ceil( (space.width) / (data.length * ((_data.length/2)+1)));
  _range = getRange(data);

  for (var i = 0, len = _data.length; i < len; i++) {
    if (_data[i].displayType == "bar")
      _renderBarGraph(_data, i);
    if (_data[i].displayType == "line")
      _renderLine(_data, i);
  }

  _renderKey(_data);
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

function _renderBarGraph(data, idx) {  

  var key = data[idx].key
    , selected = _bars.selectAll('rect.bar-'+key).data(data[idx].data, function(d) { return d.time.toUTCString(); })
    , floor = space.height - space.margin
    , fn = {
      x: function(d, i) {
        // time division + index division
       return (i * _barWidth * ((_data.length/2)+1)) + (_barWidth * idx)
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

function _renderLine(data, idx) {

  var key = data[idx].key
    , selected = _lines.append('path').attr('id','line-'+key)
    , floor = space.height - space.margin
    , line = d3.svg.line().interpolate('basis')
      .x(function(d, i) { 
        return (i * _barWidth * ((_data.length/2)+1)) + (_barWidth * (idx-(_data.length/2)))   + (_barWidth / 2);
      })
      .y(function(d, i) { return floor - _range(d.value); });

      selected.attr('d', line(data[idx].data)).attr('stroke', COLORS[idx+2])
}

function _renderKey(data, i) {

  if (!i) i = 0;

  var height = parseInt(_values.attr('height'));

  var selected = _values.selectAll('g').data(data);

  var keyItem = selected.enter().insert('g')
                  .attr('data-keyIndex', function (d, i) { return i; })
                  .attr('data-keyName', function (d, i) { return d.key; })
                  .attr('class', 'keyItem')
                  .attr('transform', function (d, i) { return 'translate(' + (i * _barWidth * 4 + 100) + ', ' + height / 2 + ')' })

  var circles = keyItem.append('svg:circle').attr('r',50).attr('fill',function (d, i) { return COLORS[i] });
  var amounts = keyItem.append('svg:text').attr('class','amount').attr('y', 60);
  var labels = keyItem.append('svg:text').attr('class','label').text(function (d) { return d.key });

  selected.transition().selectAll('text.amount').text(function (d) { 
    return d.data[i].value })

}

var spaceXScale = d3.scale.linear().range([0, space.width]);
var dataXScale = d3.scale.linear().domain([0, 1]).range([0, data.length]);


function _mousemove() {
  var x0 = spaceXScale.invert(d3.mouse(this)[0]);  
  var i = Math.floor(dataXScale(x0));
  console.log('i = '+i)
  _renderKey(_data, i);
}

// }());