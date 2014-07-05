var express    = require('express');

var Bear     = require('../../../models/bear');

exports = module.exports = this_module;

function this_module(options){

	var bearApi = express.Router();

	bearApi.route('/')
		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.post(function(req, res) {
			
			var bear = new Bear(); 		// create a new instance of the Bear model
			bear.name = req.body.name;  // set the bears name (comes from the request)
	
			// save the bear and check for errors
			bear.save(function(err) {
				if (err)
					res.send(err);
	
				res.json({ message: 'Bear created!' });
			});
			
		})
	
		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.get(function(req, res) {
			
			Bear
			  .find()
			  .exec(function (err, bear) {
				   if (err)
						res.send(err);
				   
				   res.json(bear);
				
			  });
			
		});
	
	return bearApi;
	 
}