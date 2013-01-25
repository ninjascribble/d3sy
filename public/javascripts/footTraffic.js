;(function() {
  var rawData = {
    "chart": {
      //"hourly": [435, 400, 372, 343, 310, 274, 203, 150, 175, 216, 218, 294, 315, 349, 385, 423, 489, 512, 523, 534, 560, 502, 478],
      "daily": [5321, 5983, 6345, 4093, 3876, 4392, 4934],
      //"weekly": [2601, 37997, 36899, 6067, 13683, 32658, 31567, 12613, 4672, 4983, 8203, 26183, 26285, 35474, 42020, 4489, 35931, 5350, 12177, 28529, 34896, 28708, 10443, 32771, 26531, 35625, 5931, 35279, 34829, 25885, 36185, 38586, 44922, 6285, 18248, 3331, 40969, 49708, 20506, 17426, 17027, 28411, 21880, 26548, 11413, 39763, 17907, 41409, 37385, 48015, 9603, 9813],
      "monthly": [117777, 12854, 174647, 48350, 106897, 172157, 12336, 151623, 103007, 59053, 45801, 180795]
    },
    "mostTraffic": {
      "date": "01/25/2013",
      "value": 213000
    },
    "leastTraffic": {
      "date": "01/24/2013",
      "value": 21000
    }
  };

  var _duration = 800;

  // Title
  var body = d3.select('body');
  body.append('h2').text('FootTraffic');

  // Dropdown
  var dropdown = body.append('select').attr('id', "foot-traffic-select")
  for(var key in rawData.chart) {
    dropdown.append('option').attr('value', key).text(key)
  };
  dropdown.on('change', update);


  // set the stage
  body.append('svg').attr('id', 'foot-traffic').attr('height', 500);

  var _stage = d3.select('#foot-traffic');

  update();

  function update() {

    var height = parseInt(_stage.style('height')), width = parseInt(_stage.style('width'));

    var data = filterData(dropdown.property('value'))
      , line = _stage.selectAll('path').data(data)
      , margin = 0
      , scaleX = d3.time.scale().domain(d3.extent(data, function (d) {
               return d.date;
            })).range([0, width])
      , scaleY = d3.scale.linear().domain(d3.extent(data, function (d) {
               return d.value;
            })).range([height, 0])       
      , sw = width
      , sh = height
      , rw = Math.ceil( (sw - margin * 2) / data.length - 1)

      , x = function(d, i) { return scaleX(d.date) }
      , y = function(d, i) { 
        return sh-scaleY(d.value) 
      }
      , h = function(d, i) { 
        return scaleY(d.value); 
      }
      , calcLine = d3.svg.line()
               .x(function (d) {
                  return x(d);
               })
               .y(function (d) {
                  return h(d, 0);
               });

    line.enter().insert('path')
        .attr('d', calcLine(data))
        // .attr('y', sh)
        // .attr('x', x)
        // .attr('width', rw)
        .transition()
            .duration(_duration);

    line.transition()
        .duration(_duration)
        .attr('d', calcLine(data));
        // .attr('y', y)
        // .attr('x', x)
        // .attr('width', rw)
        // .attr('height', h);

    line.exit().transition()
        .duration(_duration)
        .attr('d', calcLine(data))
        .remove();
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
        for(var i = data.length - 1; i > -1; i--) {
          obj = {};
          date = new Date();
          date.setDate(date.getDate() - [i]);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          dates.push(date);
          obj.date = date;
          obj.value = data[i];
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