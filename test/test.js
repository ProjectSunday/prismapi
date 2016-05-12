require('babel-register')

// var assert = require('chai').assert

global.MOCHA_TESTING = true
var app = require('../src/app')


var headers = { 'Content-Type': 'application/graphql' }

// var server = app.listen(9000, () => {
// 	console.log('=============================================================')
// 	console.log('Mocha testinsdfsdfsdfdsfg in progress')
//     console.log('Prism API server online. Port: 9000')
// 	console.log('=============================================================')

// })

var server = app.start().on('error', (e) => {
	if (e.code === 'EADDRINUSE') {
		console.log('Server already running')
		app.stop()
	} else {
		console.error(e)
	}
})


// process.on('uncaughtException', function (a,b,c) {
// 	console.log('uncaughtException',a,b,c)
// 	process.exit()
// })


// var int = setInterval(() => {
// 	console.log('int')

// 	server = app.listen(9000)
	

// 	server.on('listening', () => {
// 		console.log('listening')
// 		clearInterval(int)
// 	})

// }, 1000)

// var server = app.listen(9000)

// server.on('error', (e) => {
// 	console.log('error', e.code)
// 	server.close()
// 	if (e.code === 'EADDRINUSE') {
// 		setTimeout(function () {
// 			server = app.listen(9000)
// 		}, 1000)
// 	}
// })


// 	var listener = app.listen(9000, function (error) {

// 		if (error) {

// 			console.log('error', error)
// 			listener.close(function (a,b,c) {
// 				console.log('success close', a,b,c)
// 			})
// 		}

// 		var port = listener.address().port

// 		console.log('=============================================================')
// 		console.log('Mocha testinsdfdsfg in progress')
// 	    console.log(`Prism API server online. Port: ${port}`)
// 		console.log('=============================================================')

// 	})

// } catch (error) {
// 	console.log('error: ', error)
// }

var request = require('supertest').agent(server)



// describe('Array', function () {
// 	describe('#indexOf()', function () {
// 		it('should return -1 when the value is not present', function () {
// 			assert.equal(-1, [1,2,3].indexOf(5))
// 		})
// 	})
// })


// describe('GET /test', function () {
// 	it('should return test text', function (done) {
// 		request.get('/test')
// 			.expect('test', done)
// 	})
// })


describe('POST /graphql', function () {
	it('should return json data', function (done) {
		request.post('/graphql')
			.set(headers)
			.send('query RootQueryType { count }')
			.expect({ data: { count: 0 } }, done)
	})
})

// describe('query test', function () {
// 	it('should return testvalue', function (done) {
// 		request.post('/graphql')
// 			.set(headers)
// 			.send('query RootQueryType { test, count }')
// 			.expect({ data: { test: 'testvalue', count: 0 } }, done)
// 	})
// })


// describe('query foo', function () {
// 	it('should return foovalue', function (done) {
// 		request.post('/graphql')
// 			.set(headers)
// 			.send('query RootQueryType { foo }')
// 			.expect({ data: { foo: 'foovalue', count: 0 } }, done)
// 	})
// })




