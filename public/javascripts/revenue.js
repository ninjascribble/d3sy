;(function() {

// Title
d3.select('body').append('h2').text('Revenue vs. Projected Revenue');
d3.select('body').append('svg').attr('id', 'revenue').attr('height', 200);

var _stage = d3.select('#revenue')
  , _duration = 800;

}());