'use strict';

var nconf = require('nconf');

var global = __dirname + '/config.json';
var local  = __dirname + '/../../../fifaticketplus-local-config.json';
var test   = __dirname +'/config_test.json';

console.log("Configuring fifaticketplus'! Welcome!");
console.log("  argv             : [parametros linha de comando] ");
nconf.argv();
console.log("  env              : [variaveis de ambiente] ");
nconf.env();

if (nconf.get('NODE_ENV') == 'test') {
	   console.log("  test             : " + test);
	   nconf.file('test', { file: test });
}

console.log("  local            : " + local);
nconf.file('user', { file: local });
console.log("  global (default) : " + global);
nconf.file('global', { file: global });

nconf.load();

module.exports = nconf;