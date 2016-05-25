import { assert, expect } from 'chai'
import supertest from 'supertest'

import app from '../src/app'


const headers = { 'Content-Type': 'application/graphql' }

var request, listener

describe('Prism API Mocha Testing', () => {

	before(done => {
		console.log('===================================================================')
		app.then(runningServer => {
			listener = runningServer
			request = supertest.agent(listener)
			done()
		})
	})

	///////////////////////////////////////////////////////////////////////////////////

	it('it should return all categories', done => {
		request.post('/graphql')
			.set(headers)
			.send('query { categories { _id } }')
			.end((err, res) => {
				// console.log(res.body)
				assert.isArray(res.body.data.categories)
				done()
			})
	})


	var addedCategoryId

	it('it should create a category', done => {
		request.post('/graphql')
			.set(headers)
			.send('mutation { createCategory (name: "testtesttest") { _id, name } }')
			.end((err, res) => {
				// console.log(res.body)
				addedCategoryId = res.body.data.createCategory._id
				expect(res.body.data.createCategory._id).to.be.a('string')
				done()
			})
	})

	it('it should remove a category', done => {
		request.post('/graphql')
			.set(headers)
			.send(`mutation { deleteCategory(_id: "${addedCategoryId}") { _id, status } }`)
			.end((err, res) => {
				// console.log(res.body)
				assert.equal(res.body.data.deleteCategory.status, 'DELETE_SUCCESS')
				done()
			})
	})

	it('it should return all requested classes', done => {
		request.post('/graphql')
			.set(headers)
			.send(`query { requestedClasses { _id, name } }`)
			.end((err, res) => {
				assert.equal(res.body.data.requestedClasses.length > 0, true)
				done()
			})
	})

	var createRequestedClassId;

	it('it should add a requested class', done => {
		request.post('/graphql')
			.set(headers)
			.send(`
				mutation {
					createRequestedClass (name: "testrequestedclass") { 
						_id,
						name 
					} 
				}`
			)
			.end((err, res) => {
				// console.log(res.body)
				assert.equal(res.body.data.createRequestedClass.name, 'testrequestedclass')
				createRequestedClassId = res.body.data.createRequestedClass._id
				done()
			})
	})

	it('it should remove a requested class', done => {
		request.post('/graphql')
			.set(headers)
			.send(`
				mutation {
					deleteRequestedClass(_id: "${createRequestedClassId}") { 
						_id,
						status 
					} 
				}`
			)
			.end((err, res) => {
				// console.log(res.body)
				assert.equal(res.body.data.deleteRequestedClass._id, createRequestedClassId)
				assert.equal(res.body.data.deleteRequestedClass.status, 'DELETE_SUCCESS')
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


