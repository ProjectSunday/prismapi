import { assert, expect } from 'chai'
import supertest from 'supertest'

import '../debug'

import App from '~/app'

const HEADERS 					= { 'Content-Type': 'application/graphql' }

// var LOCAL_LEARNER_TEST_USER_TOKEN 	= 'ab34ab95b97d1fa0f483d24acff5d882'
// var LOCALLEARNERTESTUSERID 			= '5769d3a7ac06af8f0457c10f'

var TEST_UPCOMING_CLASS_ID

var CREATED_REQUEST_CLASS_ID

var request

describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		var app = await App.start()
		request = supertest.agent(app.listener)
		done()
	})

	///////////////////////////////////////////////////////////////////////////////////


	it('should return all requested classes', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				query {
					requestedClasses {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				assert.isArray(res.body.data.requestedClasses)
				done()
			})
	})

	it('should add a requested class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					createRequestedClass (name: "testrequestedclass") {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { _id, name } = res.body.data.createRequestedClass
				expect(_id).to.exist
				expect(name).to.equal('testrequestedclass')
				CREATED_REQUEST_CLASS_ID = _id
				done()
			})
	})

	it('should delete a requested class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					deleteRequestedClass(_id: "${CREATED_REQUEST_CLASS_ID}") {
						_id,
						status
					}
				}`
			)
			.end((err, res) => {
				// log(res.body)
				var { _id, status } = res.body.data.deleteRequestedClass
				expect(_id).to.equal(CREATED_REQUEST_CLASS_ID)
				expect(status).to.equal('DELETE_SUCCESS')
				done()
			})
	})


	///////////////////////////////////////////////////////////////////////////////////

	after(async (done) => {
		await App.stop()
		done()
	})

})


