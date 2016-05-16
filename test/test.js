require('babel-register')

global.MOCHA_TESTING = true
var app = require('../src/app')

// var assert = require('chai').assert

var headers = { 'Content-Type': 'application/graphql' }

var server = app.listen(() => {
	var port = server.address().port
	console.log('=============================================================')
	console.log('Mocha Testing in progress')
    console.log(`Prism API server online. Port: ${port}`)
	console.log('=============================================================')
})

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
	it('should return data', function (done) {
		request.post('/graphql')
			.set(headers)
			.send('query RootQueryType { count }')
			.expect({ data: { count: 0 } }, done)
	})
})

describe('query categories', () => {
	it('it should return all categories', (done) => {
		var expected = {
			data: {
				categories: [
					{ id: 1 },
					{ id: 2 },
					{ id: 3 }
				]
			}
		}

		request.post('/graphql')
			.set(headers)
			.send('query { categories { id } }')
			.expect(expected, done)
	})
})

describe('query categories with name', () => {
	it('it should return all categories with name only', (done) => {
		var expected = {
			data: {
				categories: [
					{ name: 'cat1' },
					{ name: 'cat2' },
					{ name: 'cat3' }
				]
			}
		}

		request.post('/graphql')
			.set(headers)
			.send('query { categories { name }	}')
			.expect(expected, done)
	})
})


