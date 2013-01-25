;(function() {

// Title
d3.select('body').append('h2').text('Dancing Bar Graph');
d3.select('body').append('svg').attr('id', 'main').attr('height', 200);

var _stage = d3.select('#main')
  , _duration = 800;

update();
setInterval(update, _duration);

/*
 * SVG Shapes: https://github.com/mbostock/d3/wiki/SVG-Shapes
 */
function update() {

    var data = createRandomData(12, 80, 140)
      , rects = _stage.selectAll('rect').data(data)
      , margin = 0
      , sw = parseInt(_stage.style('width'))
      , sh = parseInt(_stage.style('height'))
      , rw = Math.ceil( (sw - margin * 2) / data.length - 1)

      , x = function(d, i) { return i * rw + i }
      , y = function(d, i) { return sh - d }
      , h = function(d, i) { return d; };

    rects.enter().insert('rect')
        .attr('y', sh)
        .attr('x', x)
        .attr('width', rw)
        .transition()
            .duration(_duration)
            .attr('y', y)
            .attr('height', h);

    rects.transition()
        .duration(_duration)
        .attr('y', y)
        .attr('x', x)
        .attr('width', rw)
        .attr('height', h);

    rects.exit().transition()
        .duration(_duration)
        .attr('height', 0)
        .remove();
}

/*
 * Utilities
 * ========= */
function createRandomData(amount, min, max) {

    var result = []
      , seed = seed || 42
      , i = 0
      , len = amount || 12;

    for (i; i < len; i++) {
        result.push(Math.random() * (max - min) + min);
    }

    return result;
}

function createLogarithmicData(amount, seed) {

    var result = []
      , seed = seed || 42
      , i = 2
      , len = amount++ || 12++;

    for (i; i <= len; i++) {
        result.push(seed * Math.log(i));
    }

    return result;
}
}());