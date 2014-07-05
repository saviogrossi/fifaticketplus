var express    = require('express');
var path       = require('path');

exports = module.exports = this_module;

function this_module(options){

	var expressAngularRoutes = express.Router();
	
	expressAngularRoutes.get('/partials/*', function(req, res) {
        var stripped = req.url.split('.')[0];
        var requestedView = path.join('./', stripped);
        res.render(requestedView, function(err, html) {
          if(err) {
            res.render(404, '404');
	      } else {
	        res.send(html);
	      }
        });	
	});
	
	expressAngularRoutes.get('/*', function(req, res) {
		res.render('index');
	});
	
	return expressAngularRoutes;
	 
}