var express         = require('express');
// var bodyParser      = require('body-parser');
var http            = require('http');

var app = express();
var server = http.createServer(app);

var port = process.env.PORT || 9000

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

app.get('/testjson', function (req, res) {
	res.json({ test: 'testvalue' })
})
// app.use('/', express.static(__dirname + '/../dist'));
// app.use('*', express.static(__dirname + '/../dist/index.html'));


if (!module.parent) {   //require for mocha to work, DO NOT DELETE!
	server.listen(port, function () {
		console.log('\n')
		console.log('=============================================================')
	    console.log('Prism API server online. Port:', port, ' Environment:', 'BLAH')
		console.log('=============================================================')
		console.log('\n')
	})
}


module.exports = server

