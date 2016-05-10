var app = require('../src/app')

var assert = require('chai').assert
var request = require('supertest').agent(app.listen())



describe('Array', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			assert.equal(-1, [1,2,3].indexOf(5))
		})
	})
})


describe('GET /test', function () {
	it('should return test text', function (done) {
		request.get('/test')
			.expect('test', done)
	})
})


describe('GET /testjson', function () {
	it('should return test json', function (done) {
		request.get('/testjson')
			.expect({ test: 'testvalue' }, done)
	})
})


