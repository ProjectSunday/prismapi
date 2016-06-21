import { assert, expect } from 'chai'
import supertest from 'supertest'

import '../debug'

import app from '~/app'

var LOCALLEARNERTESTUSERTOKEN = '9bad3c6873b565b4053b7876fcbbafaf'
var LOCALLEARNERTESTUSERID = '57635561a48f34c10540bc32'

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
			.send(`
				query {
					categories {
						_id
					}
				}
			`)
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




	//get this from the front end

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
				// log(res.body)
				var { token, name } = res.body.data.authenticateUser.meetupMember
				assert.equal(res.body.data.authenticateUser.meetupMember.token, LOCALLEARNERTESTUSERTOKEN)
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


	it('should create an upcoming class', done => {
		request.post('/graphql')
			.set(HEADERS)
			.send(`
				mutation {
					createUpcomingClass (token: "${LOCALLEARNERTESTUSERTOKEN}", name: "testupcomingclass") {
						_id,
						meetupEvent {
							id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				log(res.body)

				var { _id, name } = res.body.data.createUpcomingClass

				expect(_id).to.exist
				// expect(name).to.equal('testupcomingclass')
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
