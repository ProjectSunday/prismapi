global.MOCHA_TESTING = true
require('babel-register')

var app = require('../src/app')

// var assert = require('chai').assert

var headers = { 'Content-Type': 'application/graphql' }


var request = require('supertest').agent(app.listen(function () {
	console.log('=============================================================')
	console.log('Mocha Testing in progress')
    console.log('Prism API server online.')
	console.log('=============================================================')
}))



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


