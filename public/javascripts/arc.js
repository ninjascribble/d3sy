// ;
// (function() {
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

        _rotation = 0;

    // Configure the data selector
    for(var i = 0, len = _data.length; i < len; i++) {
        _selector.append('option').attr('value', i).text(_data[i].account_type);
    }

    _selector.on('change', function() {
        
        update(0, _rotation)
    });

    _snap.on('click', function() {  
        snapToPoint(arcs, _rotation); 
    });

    _slider.on('change', function() {
        var value = Math.abs(parseInt(this.value) - 450);
        _rotation = (value >= 360) ? value - 360 : value;
        _sliderLabel.text(this.value);
        update(0, this.value);
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

    update(0, _rotation);

    _group.insert('svg:line').attr('class','selectPath').attr('stroke', 'black').attr('strokeWidth', 3).attr('x0', 0).attr('y0',0).attr('x1', 500).attr('y1', 0);

    function update(idx, rotation) {

        var data = _data[idx].allocations,
            range = getRange(data),
            rotation = rotation ? rotation : 0;

        renderPie(data, range, rotation);

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

    var pie, arc, selected, globalData;

    function renderPie(data, range, rotation) {

        pie = d3.layout.pie().sort(null).value(function(d) {
            return d.value;
        });
        arc = d3.svg.arc().outerRadius((parseInt(_stage.style('height')) - margin) / 2)//.innerRadius((parseInt(_stage.style('height')) - margin) / 3);
        selected = _group.selectAll('path').data(pie(data));


        globalData = pie(data);

        selected.enter().insert('path').style('fill', function(d, i) {
            return color(i)
        });

        arcs = selected.attr('d', arc);
        arcs.attr('transform', 'rotate(' + rotation + ' 0 0)');

        if (d3.select('line.rotateLine')[0][0] !== null) {
            var midPath = d3.select('line.rotateLine');
            var rotateText = d3.select('text.rotation');
        }
        else {
            var midPath = _group.insert('svg:line').attr('class','rotateLine').attr('stroke', 'blue').attr('strokeWidth', 3).attr('x0', 0).attr('y0',0).attr('x1', 0).attr('y1', 300);
            var rotateText = _group.insert('text').attr('class','rotation').attr('stroke', 'blue').attr('strokeWidth', 3).attr('x', 0).attr('y', -300);
        }
        
        midPath.attr('transform', 'rotate(' + rotation + ' 0 0)');
        rotateText.text('angle = '+rotation)
            


        //renderLabels(data, range, rotation);
    }

    function selectedArc(rotation) {
        // var angleArray = []
        //   , obj = {};
        // pie(data).forEach(function(element, index, array) {
        //   obj = {};
        //   obj.startAngle = element.startAngle * 180 / Math.PI;
        //   obj.endAngle = element.endAngle * 180 / Math.PI;
        //   angleArray.push(obj)
        // });
        // rotation = rotation - 180;

        // rotation = rotation <= 0 ? rotation + 360 : rotation;

        var rotationRads = rotation * Math.PI / 180;
        var selected;
        arcs[0].forEach(function(element, index, array) {
            element = element.__data__;
            if (element.startAngle <= rotationRads && element.endAngle >= rotationRads) {
                element.midPoint = Math.abs(element.endAngle + element.startAngle) / 2;
                console.log('selected - '+element.midPoint)
                selected = element;                
            }
        });
        return selected;
    }

    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }

    function snapToPoint(arcs, rotation) {
        var selected = selectedArc(rotation);
        var rotateTo = Math.abs(selected.midPoint * 180 / Math.PI - 450);
        rotateTo = rotateTo >= 360 ? rotateTo - 360 : rotateTo;
        arcs.transition().duration(500).attr('transform', 'rotate(' + rotateTo + ' 0 0)');

        if (d3.select('line.midPath')[0][0] !== null) {
            var midPath = d3.select('line.midPath');
            var rotateText = d3.select('text.rotateTo');
        }
        else {
            var midPath = _group.insert('svg:line').attr('class','midPath').attr('stroke', 'green').attr('strokeWidth', 3).attr('x0', 0).attr('y0',0).attr('x1', 0).attr('y1', 300);
            var rotateText = _group.insert('text').attr('class','rotateTo').attr('stroke', 'green').attr('strokeWidth', 3).attr('x', 0).attr('y', 0);
        }
        
        midPath.attr('transform', 'rotate(' + rotateTo + ' 0 0)');
        rotateText.text('angle = '+rotateTo)
    }

    function renderLabels(data, range) {

        var selectedText = _group.selectAll('text.label').data(pie(data));
        var selectedPath = _group.selectAll('path.labelPath').data(pie(data));

        selectedText.enter().insert('text').attr('class', 'label');
        selectedPath.enter().insert('svg:line').attr('class', 'labelPath');

        selectedText.transition().duration(duration).attr('x', function(d) {
            return arc.centroid(d)[0]
        }).attr('y', function(d) {
            return arc.centroid(d)[1]
        }).text(function(d) {
            return d.data.category + ' - $' + d.data.value
        });

        selectedPath.transition().duration(duration).attr('x0', function(d) {
            return arc.centroid(d)[0]
        }).attr('x1', function(d) {
            return arc.centroid(d)[0] * 1.5
        }).attr('y0', function(d) {
            return arc.centroid(d)[1]
        }).attr('y1', function(d) {
            return arc.centroid(d)[1] * 1.5
        })
    }

    // function rotatePie(degree) {
    //    var thePie = _group.selectAll('path').data(pie(data));
    //    var theLabel = _group.selectAll('text.label').data(pie(data));
    //    var thePath = _group.selectAll('path.labelPath').data(pie(data));

    //     //rotate pie
    //     thePie.transition().attr('transform', 'rotateX('+degree+'deg)');
    // }

// }());