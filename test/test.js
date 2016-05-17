require('babel-register')

// import db from '../db'

// global.MOCHA_TESTING = true

import supertest from 'supertest'

import app from '../src/app'

server.start().



// var assert = require('chai').assert
const headers = { 'Content-Type': 'application/graphql' }



// console.info('blah22222')
// app.then((running_app) => {
// 	let request = supertest.agent(running_app)

// 	console.info('111111')
// 	startTests(request)
// })




// console.log('33333', db)

// var server = app.listen(() => {
// 	var port = server.address().port
// 	console.log('=============================================================')
// 	console.log('Mocha Testing in progress')
//     console.log(`Prism API server online. Port: ${port}`)
// 	console.log('=============================================================')
// })






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



	// console.log('333333', request)


var request;


describe('POST /graphql', function () {

	before(done => {
		server.start().then(running_server => {
			request = supertest.agent(running_app)
			done()
		})

	})


	it('should return data', function (done) {
		request.post('/graphql')
			.set(headers)
			.send('queasdasdfdsfray RootQueryType { count }')
			.expect({ data: { count: 0 } }, done)
	})


	after(done => {
		console.log('done========')
		done()
	})
})

	// describe('query categories', () => {
	// 	it('it should return all categories', (done) => {
	// 		var expected = {
	// 			data: {
	// 				categories: [
	// 					{ id: 1 },
	// 					{ id: 2 },
	// 					{ id: 3 }
	// 				]
	// 			}
	// 		}

	// 		request.post('/graphql')
	// 			.set(headers)
	// 			.send('query { categories { id } }')
	// 			.expect(expected, done)
	// 	})
	// })

	// describe('query categories with name', () => {
	// 	it('it should return all categories with name only', (done) => {
	// 		var expected = {
	// 			data: {
	// 				categories: [
	// 					{ name: 'cat1' },
	// 					{ name: 'cat2' },
	// 					{ name: 'cat3' }
	// 				]
	// 			}
	// 		}

	// 		request.post('/graphql')
	// 			.set(headers)
	// 			.send('query { categories { name }	}')
	// 			.expect(expected, done)
	// 	})
	// })


