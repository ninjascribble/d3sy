;(function() {
  var rawData = {
    "chart": {
      "hourly": [435, 400, 372, 343, 310, 274, 203, 150, 175, 216, 218, 294, 315, 349, 385, 423, 489, 512, 523, 534, 560, 502, 478],
      "daily": [5321, 5983, 6345, 4093, 3876, 4392, 4934],
      "weekly": [2601, 37997, 36899, 6067, 13683, 32658, 31567, 12613, 4672, 4983, 8203, 26183, 26285, 35474, 42020, 4489, 35931, 5350, 12177, 28529, 34896, 28708, 10443, 32771, 26531, 35625, 5931, 35279, 34829, 25885, 36185, 38586, 44922, 6285, 18248, 3331, 40969, 49708, 20506, 17426, 17027, 28411, 21880, 26548, 11413, 39763, 17907, 41409, 37385, 48015, 9603, 9813],
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

  // Title
  var body = d3.select('body');
  body.append('h2').text('FootTraffic');

  // Dropdown
  var dropdown = body.append('select')
    .attr('id',"foot-traffic-select")
  var option;
  for(var key in rawData.chart) {
    dropdown.append('option').attr('value', key).text(key)
  };


  body.append('svg').attr('id', 'main').attr('height', 200);

  var _stage = d3.select('#main');

  update(rawData);

  function update(data) {

  };

  function filterData(filter) {
    var data = [];
    switch(filter) {
    case "daily":
      var date;
      var obj;
      for(var i = rawData.chart.daily.length - 1; i > -1; i--) {
        obj = {};
        date = new Date();
        date.setDate(date.getDate() - [i]);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        dates.push(date);
        obj.date = date;
        obj.value = rawData.chart.daily[i];
        data.push(obj);
      }
      break;
    case "monthly":
      var date;
      var obj;
      for(var i = rawData.chart.monthly.length - 1; i > -1; i--) {
        obj = {};
        date = new Date();
        date.setMonth(date.getMonth() - [i]);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        dates.push(date);
        obj.date = date;
        obj.value = rawData.chart.monthly[i];
        data.push(obj);
      }
      break;
    }
    data.sort(function(a, b) {
      return a.date - b.date;
    });
    return data;
  }
}());