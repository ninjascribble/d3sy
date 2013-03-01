;
(function() {
    var data = {
        client: {

            id: '123456789',

            name: {
                first: 'John',
                last: 'Doe',
                mi: 'E'
            },

            contact: {
                home: '206-555-1212',
                mobile: '404-666-1212',
                business: '404-777-2323x12',
                email: 'johnedoe@live.com'
            },

            family: [{
                name: {
                    first: 'Kathy',
                    last: 'Doe',
                    mi: null
                },
                relationship: 'spouse'
            }, {
                name: {
                    first: 'Jim',
                    last: 'Doe',
                    mi: 'E'
                },
                relationship: 'child'
            }, {
                name: {
                    first: 'Sara',
                    last: 'Doe',
                    mi: null
                },
                relationship: 'child'
            }],

            interests: ['John and Kathy coach youth sport teams', 'John is an avid golfer and on the board of Bushwood Country Club'],

            portfolio: [{
                account_type: 'taxable',
                allocations: [{
                    category: 'real estate',
                    value: 619000
                }, {
                    category: 'fixed assets',
                    value: 726000
                }, {
                    category: 'equity',
                    value: 34147
                }, {
                    category: 'cash',
                    value: 706000
                }]
            }, {
                account_type: 'ira',
                allocations: [{
                    category: 'real estate',
                    value: 310000
                }, {
                    category: 'fixed assets',
                    value: 180000
                }, {
                    category: 'equity',
                    value: 75000
                }, {
                    category: 'cash',
                    value: 200000
                }]
            }, {
                account_type: '401k',
                allocations: [{
                    category: 'real estate',
                    value: 1120232
                }, {
                    category: 'fixed assets',
                    value: 800000
                }, {
                    category: 'equity',
                    value: 650000
                }, {
                    category: 'cash',
                    value: 706000
                }]
            }],

            retirement: []
        }
    }

    // Build the DOM
    d3.select('body').append('h2').text('Arc');


    var _inputs = d3.select('body').append('div').attr('id', 'arc-inputs'),
        _selector = _inputs.append('select').attr('id', 'arc-selector'),
        _slider = _inputs.append('input').attr('type', 'range').attr('min', '0').attr('max', '360').attr('value', 0).attr('style', 'width: 500px'),
        _sliderLabel = _inputs.append('p').attr('class', 'sliderLabel'),
        _snap = _inputs.append('button').attr('id', 'snapButton').attr('value', 'snap').text('snap'),

        _stage = d3.select('body').append('svg').attr('id', 'arc').attr('height', 800),
        _group = _stage.append('g').attr('transform', 'translate(600, 400)'),
        _data = data.client.portfolio,
        _colors = ["#40000", "#660000", "8C0000", "B22222"],

        _rotation = { selectPoint: 0, rotate: 0 };

    // Configure the data selector
    for(var i = 0, len = _data.length; i < len; i++) {
        _selector.append('option').attr('value', i).text(_data[i].account_type);
    }

    _selector.on('change', function() {
        
        update(0, _rotation)
    });

    _snap.on('click', function() {  
        snapToPoint(arcs, parseInt(_rotation.selectPoint)); 
    });

    _slider.on('change', function() {
        _rotation.rotate = this.value;

        var value = Math.abs(parseInt(this.value) - 450);
        _rotation.selectPoint = (value >= 360) ? value - 360 : value;

        _sliderLabel.text(JSON.stringify(_rotation));
        rotatePie();
    });

    // Stash the moving parts of the chart
    var margin = 20,
        duration = 300,
        formatters = {
            monthly: d3.time.format('%b'),
            daily: d3.time.format('%a'),
            currency: d3.format('s')
        },
        color = d3.scale.ordinal().range(_colors);

    update(0);

    _group.insert('svg:line').attr('class','selectPath').attr('stroke', 'black').attr('strokeWidth', 3).attr('x0', 0).attr('y0',0).attr('x1', 500).attr('y1', 0);

    function update(idx) {

        var data = _data[idx].allocations,
            range = getRange(data);
        renderPie(data, range);

    }

    function getRange(data) {

        var combinedData = [],
            i = 0,
            len = data.length,
            result;

        for(i; i < len; i++) {
            combinedData.push(data[i].value);
        }

        result = d3.scale.linear().domain([0, d3.max(combinedData)]).range([margin * 2, parseInt(_stage.style('height')) - margin * 4]);

        return result;
    }

    var pie, arc, selected;

    function renderPie(data, range) {

        pie = d3.layout.pie().sort(null).value(function(d) {
            return d.value;
        });
        arc = d3.svg.arc().outerRadius((parseInt(_stage.style('height')) - margin) / 2).innerRadius((parseInt(_stage.style('height')) - margin) / 3);
        selected = _group.selectAll('path').data(pie(data));

        selected.enter().insert('path').style('fill', function(d, i) {
            return color(i)
        });

        arcs = selected.attr('d', arc);
        
    }

    function rotatePie() {
        arcs.attr('transform', 'rotate(' + _rotation.rotate + ' 0 0)');
    }

    function selectedArc() {
        var rotationRads = _rotation.selectPoint * Math.PI / 180;
        var selected;
        arcs.each(function(val, i) {
            if (val.startAngle <= rotationRads && val.endAngle >= rotationRads) {
                val.midPoint = (val.endAngle + val.startAngle) / 2 * 180 / Math.PI;
                selected = val;
                return val;             
            }
        })
        return selected;
    }

    function snapToPoint() {
        var selected = selectedArc();
        var rotateTo = Math.abs(selected.midPoint - 450);
        rotateTo = rotateTo >= 360 ? rotateTo - 360 : rotateTo;
        arcs.transition().duration(500).attr('transform', 'rotate(' + rotateTo + ' 0 0)');
    }

}());