;(function() {

// Build the DOM
d3.select('body').append('h2').text('Returns');

var _selector = d3.select('body').append('select').attr('id', 'returns-selector')
  , _stage = d3.select('body').append('svg').attr('id', 'returns').attr('height', 200)
  , _data = {

  	monthly: [
      {
        time: new Date('1/31/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      }
  	],

  	daily: [
      {
        time: new Date('1/1/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
      {
        time: new Date('1/2/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
      {
        time: new Date('1/3/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
      {
        time: new Date('1/4/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
      {
        time: new Date('1/5/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
      {
        time: new Date('1/6/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
      {
        time: new Date('1/7/2012'),
        products: [
          { product: 'Chicken Strips',    value: 155 },
          { product: 'Gloves',            value: 175 },
          { product: 'Hair Dryer',        value: 181 },
          { product: 'Cheese',            value: 136 },
          { product: 'Microwave Oven',    value: 213 },
          { product: 'Microsoft Surface', value: 132 },
          { product: 'Knives',            value: 119 },
          { product: 'Cookies',           value: 149 }
        ]
      },
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

	var data = _data[type][0].products
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

  renderPie(data, range);
  // renderLabels(data, range);
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

function renderPie(data, range) {

  console.log(data);

  var pie = d3.layout.pie().value(function(d) { console.log(d); return d.value; })
    , selected = _stage.selectAll('path').data(pie)
    , arc = d3.svg.arc().outerRadius(100);

  selected.enter().insert('path')
    .attr('x', 100)
    .attr('y', 100)
    .attr('d', arc);

}

}());