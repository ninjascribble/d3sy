;
(function() {
  var rawData = {
    "chart": {
      "daily": {
        "promotionAmt": [100000, 50000, 125000, 150000, 100000, 130000, 50000],
        "salesAmt": [80000, 130000, 100000, 140000, 150000, 130000, 200000]
      },
      "monthly": {
        "promotionAmt": [120000, 150000, 125000, 100000, 170000, 130000, 170000, 200000, 145000, 180000, 190000, 100000],
        "salesAmt": [100000, 150000, 175000, 140000, 90000, 110000, 200000, 210000, 230000, 250000, 240000, 275000]
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
  // var promotionPath = _stage.append('path');
  // var salesPath = _stage.append('path');
  var group = _stage.append('g');
  var margin = 50;
  // promotionPath.attr("transform", "translate(" + margin + "," + margin + ")");
  // salesPath.attr("transform", "translate(" + margin + "," + margin + ")");
  group.attr("transform", "translate(" + margin + "," + margin + ")");

  var current;

  update();

  function update() {

    var height = parseInt(_stage.style('height')),
      width = parseInt(_stage.style('width')),
      pathGroup;

    var filter = dropdown.property('value'),
      data = filterData(filter),
      sw = width - (margin * 2),
      sh = height - (margin * 2),
      scaleX = d3.time.scale().range([0, sw])
        .domain([
          d3.min(data, function (d) { return d3.min(d.values, function (e) { return e.date }); }),
          d3.max(data, function (d) { return d3.max(d.values, function (e) { return e.date }); })
        ]),
      scaleY = d3.scale.linear().range([sh, 0])
        .domain([
          d3.min(data, function (d) { return d3.min(d.values, function (e) { return e.value }); }),
          d3.max(data, function (d) { return d3.max(d.values, function (e) { return e.value }); })
        ]),
      rw = Math.ceil((sw - margin * 2) / data.length - 1),
      x = function(d, i) {
        return scaleX(d)
      },
      y = function(d, i) {
        return scaleY(d);
      },
      
      flattenLine = d3.svg.area().interpolate("cardinal").x(function(d) { 
        console.log("flatten "+current.scaleX(d.date));
        return current.scaleX(d.date); 
      }).y0(height).y1(height),

      scaleXLine = d3.svg.area().x(function(d) { 
        console.log("scale "+x(d.date));
        return x(d.date); 
      }).y0(height).y1(height),
      calcArea = d3.svg.area().interpolate("cardinal").x(function(d) { 
        console.log("calc "+x(d.date));
        return x(d.date); 
      }).y0(height).y1(function(d) { 
        return y(d.value); 
      });

      pathGroup = _stage.selectAll('.pathGroup').data(data);

      pathGroup.enter().append('path')
        .attr('class','pathGroup area')
        .attr("transform", "translate(" + margin + "," + margin + ")");

      if (current) {
        pathGroup.transition().duration(_duration).delay(000).attr('d', function (d, i) { 
          return flattenLine(current.data[i].values) 
        });
        //pathGroup.transition().duration(0).delay(_duration).attr('d', function (d, i) { return scaleXLine(d.values) });
      }

      pathGroup.transition().duration(_duration).delay(_duration)
        .attr('id', function (d) { return d.name })
        .attr('d', function (d) { return calcArea(d.values) } );


      // if(current) {
      //   line.transition().duration(_duration).delay(000).attr('d', flattenLine(current.data));
      //   line.transition().duration(0).delay(_duration).attr('d', scaleXLine(data));
      // }

      // line.transition().duration(_duration).delay(_duration * 1).attr('d', calcLine(data));

      //promotionLine.transition().duration(_duration).delay(_duration).attr('d', calcArea(data));

    current = {
      data: data,
      scaleX: scaleX,
      scaleY: scaleY
    };
  };

  function filterData(filter) {
    filteredData = [];

    var data = rawData.chart[filter];
    var i = 0;

    switch(filter) {
    case "daily":
      var date;
      var keyObj;
      var pathObj;

      for (var key in data) {
        keyObj = {}
        keyObj.name = key;
        keyObj.values = [];

        for(var i = 6; i > -1; i--) {
          pathObj = {};
          date = new Date();
          date.setDate(date.getDate() - [i]);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          pathObj.date = date;
          pathObj.value = data[key][i]

          keyObj.values.push(pathObj);
        }

        filteredData.push(keyObj);
      }
      

      
      break;
    case 'monthly':
      var date;
      var keyObj;
      var pathObj;

      for (var key in data) {
        keyObj = {}
        keyObj.name = key;
        keyObj.values = [];

        for(var i = 6; i > -1; i--) {
          pathObj = {};
          date = new Date();
          date.setMonth(date.getMonth() - [i]);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          pathObj.date = date;
          pathObj.value = data[key][i]

          keyObj.values.push(pathObj);
        }

        filteredData.push(keyObj);
      }        
      break;
    }
    filteredData.sort(function(a, b) {
      return a.date - b.date;
    });

    return filteredData;
  }

}());