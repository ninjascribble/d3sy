;(function() {
    'use strict';

    var _stage = d3.select('body').append('svg').attr('height', 200)
      , _line = _stage.append('path')
      , _interval = 400
      , _filter = 'hourly'
      , _cache = []
      , _needsTranslation = false;

    var range = {
        x: d3.scale.linear(),
        y: d3.scale.linear()
    };

    range.x.domain([0, 23]);
    range.x.range([0, parseInt(_stage.style('width'))]);

    range.y.domain([50, 200]);
    range.y.range([parseInt(_stage.style('height')) - 20, 20]);

    for (var i = 0; i < 24 * 365; i++) {
        XYZ.step();
    }

    setInterval(step, _interval);

    function step() {
        
        var data = XYZ.model[_filter];

        data = unshift(data);
        renderPath(data);
        _cache = shift(data);

        XYZ.step();
    }

    function unshift(data) {
        if (_cache && _cache.length > 0) {
            data.unshift(_cache[0]);
            _needsTranslation = true;
        }
        return data;
    }

    function shift(data) {
        if (_cache && _cache.length > 0) {
            data.shift();
        }
        _needsTranslation = false;
        return data;
    }

    function renderPath(data) {

        var line = d3.svg.line();
            line.x(function(d, i) { return range.x(i) });
            line.y(function(d, i) { return range.y(d.value) });

        if (_needsTranslation == false) {
            _line.attr('d', line(data));
        }
        else {
            _line.attr('d', line(data))
                .attr('transform', null)
                .transition()
                    .duration(_interval)
                    .ease('linear')
                    .attr('transform', 'translate(' + range.x(-1) + ')');
        }
    }

}());