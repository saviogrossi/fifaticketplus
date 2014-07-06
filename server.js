// server.js

var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var http       = require('http'); 			
var https      = require('https'); 			
var path       = require('path');
var fs         = require('fs');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');
var corser     = require('corser');
var _          = require('underscore');


var appConfig = require('./lib/config');


// Configure Express4
app.engine('html', expressHbs({extname:'html'}));
app.set('view engine', 'html');

var rootPath = path.normalize(__dirname + '');
var env = process.env.NODE_ENV || 'development';

app.use(bodyParser());
app.use(corser.create({
	//origins: ['fwctickets.fifa.com'],
    methods: corser.simpleMethods.concat(["PUT", "DELETE"]),
    requestHeaders: corser.simpleRequestHeaders.concat(["Authorization", "Accept-Encoding", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Connection", "Host", "Origin", "User-Agent"]),    
}));


if ('production' == env) {
	app.set('views', rootPath + '/dist');
	app.use(express.static(path.join(rootPath, 'dist')));
}
else {
	app.use(function noCache(req, res, next) {
//      if (req.url.indexOf('/scripts/') === 0) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
//      }
        next();
	});	
	app.set('views', rootPath + '/app');
	app.use(express.static(path.join(rootPath, '.tmp')));
	app.use(express.static(path.join(rootPath, 'app')));
}

var port = process.env.PORT || 3000; 		// set our port
var portssl = process.env.PORTSSL || 3443; 		// set our port

//database
var mongoose   = require('mongoose');
var dbUser = appConfig.get('db:user');
var dbPass = appConfig.get('db:pass');
var dbHost = appConfig.get('db:host');
var dbPort = appConfig.get('db:port');
var database = appConfig.get('db:database');
mongoose.connect('mongodb://'+dbUser+":"+dbPass+"@"+dbHost+":"+dbPort+"/"+database); // connect to our database

// API V1
var appApiV1 = require('./lib/apis/v1');
app.use('/api/v1', appApiV1());

var expressAngularRoutes = require('./lib/express-angular-routes');
app.use('/', expressAngularRoutes());


//app.listen(port);
http.createServer(app).listen(port);

var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

https.createServer(credentials, app).listen(portssl);
console.log('Magic happens on port ' + port + ' and '+portssl);

process.on('uncaughtException', function (err) {
	console.log('uncaughtException: '+err);
});

var Ticket = require('./lib/models/ticket');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('uir198jPhOy613kxWR4iEA');


var monTicket = function() {
	
	Ticket.find().exec(function (err, tickets) {
		if (err) {
			console.log(' [monTicket]: ERROR: '+err);
		}
		else {
			
			var totalTickets = 0;
			var totalTicketsZero = 0;
			var totalTicketsForUs = 0;
			_.each(tickets, function (item) {
				totalTickets += item.ticketsAll.length;
				totalTicketsZero += item.ticketsZero.length;
				totalTicketsForUs += item.ticketsForUs.length;
			});
			
			console.log(' [monTicket]: totalRequests: '+tickets.length + ', totalTicketsZero: '+totalTicketsZero+ ', totalTicketsForUs: '+totalTicketsForUs);
			
			var subject = tickets.length + ' tickets monitorados, nada ainda!';
			var msg = 'Não se preocupe, continuo monitorando, sou brasileiro, não desisto nunca! Caso apareça algum ticket disponível, mando email na hora, do contrário, mando outro relatório em 30 minutos.';
			if (totalTicketsZero > 0 || totalTicketsForUs >0) {
				subject = 'OPA, ATENÇÃO! '+totalTicketsForUs+' com disponibilidade > 0 & '+totalTicketsZero+' com disponibilidade = 0';
				msg = 'Aja rápido! https://fwctickets.fifa.com/ticketingsystem.aspx?l=en#Tck2 ';
			}
			
	
			var message = {
				    "html": "<p>"+msg+"</p>",
				    "text": msg,
				    "subject": subject,
				    "from_email": "savio@pertoo.com",
				    "from_name": "SavioFifaTickets",
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
//			var ip_pool = "Main Pool";
//			var send_at = "example send_at";
			
			mandrill_client.messages.send({"message": message, "async": async}, function(result) {
			    console.log('[mandrill result]: ' + JSON.stringify(result, null, 2));
			}, function(e) {
			    // Mandrill returns the error as an object with name and message keys
			    console.log('[mandrill error]: ' + e.name + ' - ' + e.message);
			    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
			});
			
		}
	});
	
}

monTicket();
setInterval(monTicket, 1800000); // 30 minutos



module.exports.app = app;
module.exports.port = port;