;
(function() {
  var rawData = {
    "chart": {
      "daily": {
        "promotionAmt": [100000, 50000, 125000, 150000, 100000, 130000, 50000],
        "salesAmt": [80000, 130000, 100000, 140000, 150000, 130000, 200000]
      },
      "monthly": {
        "promotionAmt": [100000, 50000, 125000, 150000, 100000, 130000, 50000],
        "salesAmt": [80000, 130000, 100000, 140000, 150000, 130000, 200000]
      }
    }
  };

  var _duration = 400;

  // Title
  var body = d3.select('body');
  body.append('hr');
  body.append('h2').text('Promotions');

  // Dropdown
  var dropdown = body.append('select').attr('id', "promotions-select")
  for(var key in rawData.chart) {
    dropdown.append('option').attr('value', key).text(key)
  };
  dropdown.on('change', update);


  // set the stage
  body.append('svg').attr('id', 'promotions').attr('height', 500);

  var _stage = d3.select('#promotions');
  var path = _stage.append('path');
  var group = _stage.append('g');
  var margin = 50;
  path.attr("transform", "translate(" + margin + "," + margin + ")");
  group.attr("transform", "translate(" + margin + "," + margin + ")");

  var current;

  update();

  function update() {

    var height = parseInt(_stage.style('height')),
      width = parseInt(_stage.style('width'));

    var filter = dropdown.property('value'),
      data = filterData(filter)
      line = path.data(data),
      meta = group.selectAll('g').data(data, function (d) { 
          return d.date;
      }),
      sw = width - (margin * 2),
      sh = height - (margin * 2),
      scaleX = d3.time.scale().domain(d3.extent(data, function(d) {
        return d.date;
      })).range([0, sw]),
      scaleY = d3.scale.linear().domain(d3.extent(data, function(d) {
        return d.promotionAmt;
      })).range([sh, 0]),
      rw = Math.ceil((sw - margin * 2) / data.length - 1),
      x = function(d, i) {
        return scaleX(d.date)
      },
      y = function(d, i) {
        return sh - scaleY(d.promotionAmt)
      },
      h = function(d, i) {
        return scaleY(d.promotionAmt);
      },
      flattenLine = d3.svg.line().x(function(d) { return current.scaleX(d.date); }).y(function(d) { return height / 2; }),
      scaleXLine = d3.svg.line().x(function(d) { return x(d); }).y(function(d) { return height / 2; }),
      calcArea = d3.svg.area().interpolate("cardinal").x(function(d) { return x(d); }).y0(height).y1(function(d) { return h(d, 0); });


    line.transition().duration(_duration).delay(_duration * 1).attr('d', calcArea(data));

    current = {
      data: data,
      scaleX: scaleX,
      scaleY: scaleY
    };
  };

  function filterData(filter) {
    filteredData = [];

    var data = rawData.chart[filter];
    var dates = Array(data.length);
    var i = 0;

    switch(filter) {
    case "daily":
      var date;
      var obj;
      for(var i = 6; i > -1; i--) {
        obj = {};
        date = new Date();
        date.setDate(date.getDate() - [i]);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        dates.push(date);

        for (var key in data) {
          obj[key] = data[key][i];          
        }
        obj.date = date;
        filteredData.push(obj);
      }
      break;
    case 'monthly':
    default:
      var obj;
      for(i; i < data.length; i++) {
        obj = {};
        dates[i] = new Date();
        dates[i].setMonth(dates[i].getMonth() - i);
        obj.date = dates[i];
        obj.value = data[i];
        filteredData.push(obj);
      }
      break;
    }
    filteredData.sort(function(a, b) {
      return a.date - b.date;
    });

    return filteredData;
  }

}());