;(function() {
var data = {
    client: {

        id: '123456789',
        
        name: {
            first: 'John',
            last:  'Doe',
            mi:    'E'
        },

        contact: {
            home:     '206-555-1212',
            mobile:   '404-666-1212',
            business: '404-777-2323x12',
            email:    'johnedoe@live.com'
        },

        family: [
            { name: { first: 'Kathy', last: 'Doe', mi: null }, relationship: 'spouse' },
            { name: { first: 'Jim',   last: 'Doe', mi: 'E'  }, relationship: 'child' },
            { name: { first: 'Sara',  last: 'Doe', mi: null }, relationship: 'child' }
        ],

        interests: [
            'John and Kathy coach youth sport teams',
            'John is an avid golfer and on the board of Bushwood Country Club'
        ],

        portfolio: [
            { 
                account_type: 'taxable',
                allocations: [
                    { category: 'real estate',  value: 619000 },
                    { category: 'fixed assets', value: 726000 },
                    { category: 'equity',       value: 34147 },
                    { category: 'cash',         value: 706000 }
                ]
            },
            { 
                account_type: 'ira',
                allocations: [
                    { category: 'real estate',  value: 310000 },
                    { category: 'fixed assets', value: 180000 },
                    { category: 'equity',       value: 75000 },
                    { category: 'cash',         value: 200000 }
                ]
            },
            { 
                account_type: '401k',
                allocations: [
                    { category: 'real estate',  value: 1120232 },
                    { category: 'fixed assets', value: 800000 },
                    { category: 'equity',       value: 650000 },
                    { category: 'cash',         value: 706000 }
                ]
            }   
        ],

        retirement: []
    }    
}

// Build the DOM
d3.select('body').append('h2').text('Arc');

var _selector = d3.select('body').append('select').attr('id', 'arc-selector')
  , _stage = d3.select('body').append('svg').attr('id', 'arc').attr('height', 200)
  , _group = _stage.append('g').attr('transform', 'translate(100, 100)')
  , _data = data.client.portfolio
  , _colors = ["#40000", "#660000", "8C0000", "B22222"];
  
// Configure the data selector
for (var i = 0, len = _data.length; i < len; i++) {
    _selector.append('option').attr('value', i).text(_data[i].account_type);
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
  }
  , color = d3.scale.ordinal().range(_colors);

update(0);

function update(idx) {

    var data = _data[idx].allocations
    , range = getRange(data);

  renderPie(data, range);
  // renderLabels(data, range);
}

function getRange(data) {

  var combinedData = []
    , i = 0
    , len = data.length
    , result;

  for (i; i < len; i++) {
    combinedData.push(data[i].value);
  }

  result = d3.scale.linear()
                .domain([0, d3.max(combinedData)])
                .range([margin * 2, parseInt(_stage.style('height')) - margin * 4]);

  return result;
}

function renderPie(data, range) {

  var pie = d3.layout.pie().value(function(d) { return d.value; })
    , arc = d3.svg.arc().outerRadius((parseInt(_stage.style('height')) - margin) / 2).innerRadius((parseInt(_stage.style('height')) - margin) / 3)
    , selected = _group.selectAll('path').data(pie(data));

  selected.enter().insert('path').style('fill', function(d, i) { 
        return color(i)
    });
  selected.transition().duration(duration).attr('d', arc);
}


}());
