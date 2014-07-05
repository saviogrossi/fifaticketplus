// server.js

var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var path       = require('path');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');
var corser     = require('corser');


var appConfig = require('./lib/config');


// Configure Express4
app.engine('html', expressHbs({extname:'html'}));
app.set('view engine', 'html');

var rootPath = path.normalize(__dirname + '');
var env = process.env.NODE_ENV || 'development';

app.use(bodyParser());
app.use(corser.create({
    methods: corser.simpleMethods.concat(["PUT", "DELETE"]),
    requestHeaders: corser.simpleRequestHeaders.concat(["Authorization"]),
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

app.listen(port);
console.log('Magic happens on port ' + port);

process.on('uncaughtException', function (err) {
	console.log('uncaughtException: '+err);
});

module.exports.app = app;
module.exports.port = port;