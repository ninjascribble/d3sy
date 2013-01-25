var _stage = d3.select('body').append('svg');

setInterval(function() {

    var circles = _stage.selectAll('circle').data(createLogarithmicData(Math.ceil( Math.random() * 12 ), Math.random() * 42));

    circles.enter().insert('circle')
        .attr('cy', 200)
        .attr('cx', function(d, i) { return i * 60 })
        .transition()
        .attr('r', function(d, i) { return d; });

    circles.transition()
        .duration(600)
        .attr('cy', 200)
        .attr('cx', function(d, i) { return i * 60 })
        .attr('r', function(d, i) { return d; });

    circles.exit().transition()
        .duration(600)
        .attr('r', 0)
        .remove();

}, 800);

/*
 * Utilities
 * ========= */
function createLogarithmicData(amount, seed) {

    var result = []
      , seed = seed || 42
      , i = 1
      , len = amount++ || 12++;

    for (i; i < len; i++) {
        result.push(seed * Math.log(i));
    }

    return result;
}
