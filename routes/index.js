
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'd3sy: A quick and dirty d3 playground' });
};