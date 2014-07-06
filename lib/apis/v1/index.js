var express    = require('express');

var sambaClassConfig = require('../../config');

exports = module.exports = this_module;

function this_module(options){

	var appApi = express.Router();	
	
	var bearsApi = require('./bears');	
	appApi.use('/bears', bearsApi());

	var ticketsmonApi = require('./ticketsmon');	
	appApi.use('/ticketsmon', ticketsmonApi());

	return appApi;
	 
}