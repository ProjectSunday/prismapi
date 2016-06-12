import { assert, expect } from 'chai'
import supertest from 'supertest'

import '../debug'

import app from '~/app'

const HEADERS = { 'Content-Type': 'application/graphql' }

var request, listener

describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		listener = await app()
		request = supertest.agent(listener)
		done()
	})

	///////////////////////////////////////////////////////////////////////////////////

	it('should return all categories', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send('query { categories { _id } }')
			.end((err, res) => {
				assert.isArray(res.body.data.categories)
				done()
			})
	})

	var addedCategoryId

	it('should create a category', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send('mutation { createCategory (name: "testtesttest") { _id, name } }')
			.end((err, res) => {
				addedCategoryId = res.body.data.createCategory._id
				expect(res.body.data.createCategory._id).to.be.a('string')
				done()
			})
	})

	it('should remove a category', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`mutation { deleteCategory(_id: "${addedCategoryId}") { _id, status } }`)
			.end((err, res) => {
				assert.equal(res.body.data.deleteCategory.status, 'DELETE_SUCCESS')
				done()
			})
	})

	it('should return all requested classes', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`query { requestedClasses { _id, name } }`)
			.end((err, res) => {
				assert.equal(res.body.data.requestedClasses.length > 0, true)
				done()
			})
	})

	var createRequestedClassId;

	it('should add a requested class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					createRequestedClass (name: "testrequestedclass") {
						_id,
						name
					}
				}`
			)
			.end((err, res) => {
				// console.log('add requested class:', res.body)
				assert.equal(res.body.data.createRequestedClass.name, 'testrequestedclass')
				createRequestedClassId = res.body.data.createRequestedClass._id
				done()
			})
	})

	it('should delete a requested class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					deleteRequestedClass(_id: "${createRequestedClassId}") {
						_id,
						status
					}
				}`
			)
			.end((err, res) => {
				assert.equal(res.body.data.deleteRequestedClass._id, createRequestedClassId)
				assert.equal(res.body.data.deleteRequestedClass.status, 'DELETE_SUCCESS')
				done()
			})
	})

	it('should not return a valid user with a bad token', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					authenticateUser (token: "badbadtoken") {
						_id
					}
				}
			`)
			.end((err, res) => {
				assert.equal(res.body.data.user, null)
				done()
			})
	})

	//get this from the front end
	var localLearnersUserToken = 'f36c3134521b55eb20481af66be80430'

	it('should authenticate the local learner test user or give unauthorized', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					authenticateUser (token: "${localLearnersUserToken}") {
						_id,
						token,
						meetup {
							id
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				if (res.body.errors) {
					assert.equal(res.body.errors[0].message, 'Unauthorized')
				} else {
					assert.equal(res.body.data.authenticateUser.token, localLearnersUserToken)
				}
				done()
			})
	})


	it('should get the fake user with the testtoken', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				query {
					user (token: "testtoken") {
						_id,
						token,
						meetup {
							id,
							photo {
								thumb_link
							}
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				expect(res.body.data.user.token).to.equal('testtoken')
				expect(res.body.data.user.meetup.id).to.equal(1111)
				expect(res.body.data.user.meetup.photo.thumb_link).to.exist
				done()
			})
	})

	it('should create an upcoming class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					createUpcomingClass (token: "testtoken", name: "testupcomingclass") {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				expect(res.body.data.createUpcomingClass._id).to.exist
				expect(res.body.data.createUpcomingClass.name).to.equal('testupcomingclass')
				done()
			})
	})


	it('should get the local learner test user', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				query {
					user (token: "testtoken") {
						_id,
						meetup {
							id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				assert.equal(res.body.data.user.meetup.id, '1111')
				assert.equal(res.body.data.user.meetup.name, 'FAKE Local Learners Test User')
				done()
			})
	})



	///////////////////////////////////////////////////////////////////////////////////

	after(done => {
		listener.close(() => {
			var rand = Math.random()
			console.log(`\n${rand}${rand}${rand}${rand}`)
			done()
		})
	})

})



// describe('Meetup API Mocha Testing', () => {
// 	it('should return a member', done => {


// 		done()
// 	})


// })
