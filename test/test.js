import { assert, expect } from 'chai'
import supertest from 'supertest'

import '../debug'

import app from '~/app'

const HEADERS 					= { 'Content-Type': 'application/graphql' }

var LOCALLEARNERTESTUSERTOKEN 	= '9bfb131b829afe763a8377777897fd05'
var LOCALLEARNERTESTUSERID 		= '5769d3a7ac06af8f0457c10f'

var UPCOMING_CLASS_TEST_CLASS_ID = '576c73f2e4027a37333a2bda'

var CREATED_REQUEST_CLASS_ID

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
			.send(`
				query {
					categories {
						_id
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				assert.isArray(res.body.data.categories)
				done()
			})
	})

	var addedCategoryId

	it('should create a category', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					createCategory (name: "testtesttest") {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				var { _id } = res.body.data.createCategory
				addedCategoryId = _id
				expect(_id).to.exist
				done()
			})
	})


	it('should remove a category', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					deleteCategory(_id: "${addedCategoryId}") {
						_id,
						status
					}
				}
			`)
			.end((err, res) => {
				var { status } = res.body.data.deleteCategory
				expect(status).to.equal('DELETE_SUCCESS')
				done()
			})
	})

	it('should authenticate the local learners test user', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					authenticateUser (token: "${LOCALLEARNERTESTUSERTOKEN}") {
						_id,
						meetupMember {
							id,
							name,
							token
						}
					}
				}
			`)
			.end((err, res) => {
				var { token, name } = res.body.data.authenticateUser.meetupMember
				assert.equal(res.body.data.authenticateUser.meetupMember.name, 'Local Learners Test User')

				var { _id } = res.body.data.authenticateUser
				log(_id, "test user id")
				done()
			})
	})

	it('should fetch the local learners test user\'s self', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				query {
					self (token: "${LOCALLEARNERTESTUSERTOKEN}") {
						_id,
						meetupMember {
							id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { _id, meetupMember } = res.body.data.self
				var { id, name } = meetupMember

				expect(_id).to.exist
				expect(id).to.exist
				expect(name).to.exist
				done()
			})
	})

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



	// it('should create an upcoming class', done => {
	// 	request.post('/graphql')
	// 		.set(HEADERS)
	// 		.send(`
	// 			mutation {
	// 				createUpcomingClass (token: "${LOCALLEARNERTESTUSERTOKEN}", name: "testupcomingclass") {
	// 					_id,
	// 					meetupEvent {
	// 						id,
	// 						name
	// 					}
	// 				}
	// 			}
	// 		`)
	// 		.end((err, res) => {
	// 			log(res.body)

	// 			var { _id, name } = res.body.data.createUpcomingClass

	// 			expect(_id).to.exist
	// 			// expect(name).to.equal('testupcomingclass')
	// 			done()
	// 		})
	// })


	it('should retrieve an upcoming class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				query {
					upcomingClass (_id: "${UPCOMING_CLASS_TEST_CLASS_ID}") {
						_id,
						event {
							id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				log(res.body)

				var { _id, event } = res.body.data.upcomingClass
				var { name } = event

				expect(_id).to.exist
				expect(name).to.equal('testupcomingclass')
				done()
			})
	})





	///////////////////////////////////////////////////////////////////////////////////

	after(done => {
		listener.close(() => {
			// var rand = Math.random()
			// console.log(`\n${rand}${rand}${rand}${rand}`)
			done()
		})
	})

})



// describe('Meetup API Mocha Testing', () => {
// 	it('should return a member', done => {


// 		done()
// 	})


// })
