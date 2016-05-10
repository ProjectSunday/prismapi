var express         = require('express');
// var bodyParser      = require('body-parser');
var http            = require('http');

var app = express();
var server = http.createServer(app);

// require('./globals.js');  //must be first
// require('./debug.js');
// require('./core.js');
// require('./mongo.js');

// app.use(bodyParser.json());                                          // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));                  // to support URL-encoded bodies


// require('./routes/main.route')(app);


app.get('/test', function (req, res) {
	res.send('test')
})
// app.use('/', express.static(__dirname + '/../dist'));
// app.use('*', express.static(__dirname + '/../dist/index.html'));


// server.listen(PRISM_PORT, function () {

if(!module.parent){ server.listen(9000); }  //require for mocha to work, DO NOT DELETE!



module.exports = server

// module.exports = server.listen(9000, function () {
// 	console.log('\n')
// 	console.log('=============================================================')
//     console.log('Prism API server online. Port:', 9000, ' Environment:', 'BLAH')
// 	console.log('=============================================================')
// 	console.log('\n')
// });

// module.exports = server