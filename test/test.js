import { assert, expect } from 'chai'
import supertest from 'supertest'

import app from '../src/app'


const headers = { 'Content-Type': 'application/graphql' }

var request, listener

describe('Prism API Mocha Testing', () => {

	before(done => {
		console.log('====================================================================================')
		app.then(runningServer => {
			listener = runningServer
			request = supertest.agent(listener)
			done()
		})
	})

	///////////////////////////////////////////////////////////////////////////////////

	it('should return data', done => {
		request.post('/graphql')
			.set(headers)
			.send('query RootQueryType { count }')
			.expect({ data: { count: 0 } }, done)
	})


	it('it should return all categories', done => {
		var expected = {
			data: {
				categories: [
					{ id: 0 },
					{ id: 1 },
					{ id: 2 }
				]
			}
		}

		request.post('/graphql')
			.set(headers)
			.send('query { categories { id } }')
			.end((err, res) => {
				assert.isArray(res.body.data.categories)
				done()
			})
	})

	it('it should add a category', done => {
		request.post('/graphql')
			.set(headers)
			.send('mutation { add(name: "test3") { id, name } }')
			.end((err, res) => {
				expect(res.body.data.add.id).to.be.a('string')
				done()
			})
	})

	it('it should remove a category', done => {
		request.post('/graphql')
			.set(headers)
			.send('mutation { removeCategory(name: "test3") { id, name } }')
			.end((err, res) => {
				expect(res.body.data.add.id).to.be.a('string')
				done()
			})
	})





	// describe('#indexOf()', function () {
	// 	it('should return -1 when the value is not present', function (done) {
	// 		done()
	// 	})
	// })




	///////////////////////////////////////////////////////////////////////////////////

	after(done => {
		listener.close(() => {
			done()
		})
	})

})

	// describe('query categories', () => {
	// 	
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


