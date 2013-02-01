exports.data = function(req, res){
  res.render('data', { title: 'd3sy: Incremental data' });
};

exports.index = function(req, res){
  res.render('index', { title: 'd3sy: A quick and dirty d3 playground' });
};

exports.lines = function(req, res) {
  res.render('lines', { title: 'd3sy: Linear interpolation' });
};