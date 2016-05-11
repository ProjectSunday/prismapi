import express from 'express'
import bodyParser from 'body-parser'
// import http from 'http'
import { graphql } from 'graphql'

let app = express()

// let server = http.createServer(app);

let port = process.env.PORT || 9000

// require('./globals.js');  //must be first
// require('./debug.js');
// require('./core.js');
// require('./mongo.js');


import Schema from './schema'


app.use(bodyParser.text({ type: 'application/graphql' }))

// app.use(bodyParser.json());                                          // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));                  // to support URL-encoded bodies


// require('./routes/main.route')(app);


// app.get('/test', function (req, res) {
// 	res.send('test')
// })

app.post('/graphql', (req, res) => {

	console.log('req', req.body)



	graphql(Schema, req.body)
		.then((result) => {
			console.log('result:', result)
			res.json(result);
			// res.send(JSON.stingify(result, null, 2))
		})

})

// app.use('/', express.static(__dirname + '/../dist'));
// app.use('*', express.static(__dirname + '/../dist/index.html'));


if (!module.parent) {   //require for mocha to work, DO NOT DELETE!
	app.listen(port, function () {
		let host = app.address().address
		let port = app.address().port

		console.log('\n')
		console.log('=============================================================')
	    console.log(`Prism API server listening on ${address}:${port}. Environment: BLAH`)
		console.log('=============================================================')
		console.log('\n')
	})
}


module.exports = app

