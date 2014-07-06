var express    = require('express');
var _          = require('underscore');

var Ticket     = require('../../../models/ticket');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('uir198jPhOy613kxWR4iEA');

exports = module.exports = this_module;

function this_module(options){

	var bearApi = express.Router();

	bearApi.route('/')
		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.post(function(req, res) {
			
			var date = new Date().toISOString();
			
			req.body.date = date;
			
			var regTicket = {
				isoDate: new Date().toISOString(),
				ticketsAll: req.body.tickets,
				ticketsZero: [],
			    ticketsForUs: []
			}
			
			_.each(regTicket.ticketsAll, function(item) {
				var quant = parseInt(item.Quantity);
				if (quant > 0) {
					regTicket.ticketsForUs.push(item);
				}
				else if (quant == 0){
					regTicket.ticketsZero.push(item);
				}
			});
			
			var logMsg = regTicket.isoDate + ': ' + regTicket.ticketsAll.length + ' tickets testados, ticketsZero: '+regTicket.ticketsZero.length+', ticketsForUs: '+regTicket.ticketsForUs.length;			
			if (regTicket.ticketsZero.length > 0 || regTicket.ticketsForUs.length > 0) {
				logMsg += ' <-- ATENCAO AQUI!!'
					
					
				var subject = 'ALERTA! '+regTicket.ticketsForUs.length+' com disponibilidade > 0 & '+regTicket.ticketsZero.length+' com disponibilidade = 0';
				var msg = 'Aja rápido! https://fwctickets.fifa.com/ticketingsystem.aspx?l=en#Tck2 ';

				var message = {
					    "html": "<p>"+msg+"</p>",
					    "text": msg,
					    "subject": subject,
					    "from_email": "savio@pertoo.com",
					    "from_name": "SAVIO_FIFA_TICKETS",
					    "to": [
				           {
				            "email": "savio@grossi.com.br",
				            "name": "Savio Grossi",
				            "type": "to"
				           },
				           {
				            "email": "rosana.bem@gmail.com",
				            "name": "Rosana Bem",
				            "type": "to"
					       }
					     ],
					    "important": true,
				};
				
				var async = false;
//				var ip_pool = "Main Pool";
//				var send_at = "example send_at";
				
				mandrill_client.messages.send({"message": message, "async": async}, function(result) {
				    console.log('[mandrill result]: ' + JSON.stringify(result, null, 2));
				}, function(e) {
				    // Mandrill returns the error as an object with name and message keys
				    console.log('[mandrill error]: ' + e.name + ' - ' + e.message);
				    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
				});	
					
			}
			console.log(logMsg);
			
			var ticket = new Ticket(regTicket);
			ticket.save(function (err, doc) {
				if (err) {
					res.json(500, err);
				}
				else {
					res.json(201, doc);									
				}
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