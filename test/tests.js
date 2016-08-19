import { assert } from 'chai'
import supertest from 'supertest'

import '../debug'

import { sendQuery, sendMutation, TestServer } from './test-server'
import { getCategoryByName, getTestUserAlpha, createTestUserBeta, deleteTestUserBeta, getLocalLearnersTestUser } from './mocks'

// import User 		from './user-tests'
import Category 	from './category-tests'
import Requested 	from './requested-tests'

import Testing from './test-testing'


describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		await TestServer.start()
		global.LOCAL_LEARNERS_TEST_USER = await getLocalLearnersTestUser()
		console.log('LOCAL_LEARNERS_TEST_USER', LOCAL_LEARNERS_TEST_USER)
		global.TEST_USER_ALPHA = await getTestUserAlpha()
		global.TEST_USER_BETA = await createTestUserBeta()
		global.CATEGORY_TECHNOLOGY = await getCategoryByName('Technology')
		done()
	})

	// Testing()

	UserTests()

	// Category()
	
	// Requested()

	UpcomingTests()


	after(async (done) => {
		await deleteTestUserBeta({ _id: TEST_USER_BETA._id })
		await TestServer.stop()
		done()
	})
})

////////////////////////////////////////////////////////////////////////////////////////////////////
//UpcomingTests
////////////////////////////////////////////////////////////////////////////////////////////////////

function UpcomingTests () {
	var UPCOMING_CLASS_ID

	describe('Upcoming Classes -', () => {

		it('should create an upcoming class', done => {
			var name = `testupcomingclass ${new Date().toString()}`
			sendMutation(`
				createUpcomingClass (token: "${LOCAL_LEARNERS_TEST_USER.token}", categoryId: "${CATEGORY_TECHNOLOGY._id}", name: "${name}") {
					_id,
					category {
						_id,
						name
					},
					event {
						id,
						name
					},
					teachers {
						_id,
						meetup {
							member {
								id,
								name
							}
						}
					}
				}
			`, data => {
				var { createUpcomingClass } = data
				assert(createUpcomingClass, 'createUpcomingClass should have data')

				var { _id, category, event, teachers } = createUpcomingClass
				assert(_id !== undefined, '_id should be defined')
				UPCOMING_CLASS_ID = _id
				assert(category, 'category should have data')
				assert(event, 'event should have data')
				assert(teachers[0], 'first teacher in teachers array should exist')

				var { _id, name } = category
				assert(_id.toString() === CATEGORY_TECHNOLOGY._id.toString(), '_id should be ' + CATEGORY_TECHNOLOGY._id)
				assert(name === CATEGORY_TECHNOLOGY.name, 'category name should be ' + CATEGORY_TECHNOLOGY.name)

				done()
			})
		})

		it('should retrieve all upcoming classes', done => {
			sendQuery(`
				upcomingClasses {
					_id
				}
			`, data => {
				var { upcomingClasses } = data
				assert(upcomingClasses, 'upcomingClasses should contain data')
				assert(upcomingClasses[0], 'first class should contain data')
				assert(upcomingClasses[0]._id !== undefined, '_id of first class should be defined')

				done()
			})
		})

		it('should retrieve an upcoming class', done => {
			sendQuery(`
				upcomingClass ( _id: "${UPCOMING_CLASS_ID}") {
					_id,
					category {
						_id
					},
					event {
						id
					},
					teachers {
						_id
					}
				}
			`, data => {
				var { upcomingClass } = data
				assert(upcomingClass, 'upcomingClass should contain data')

				var { category, event, teachers } = upcomingClass
				assert(category._id !== undefined, "category _id should exist")
				assert(event.id !== undefined, "event id should exist")
				assert(teachers[0]._id !== undefined, "first teacher _id should exist")

				done()
			})
		})

		it('should delete an upcoming class and its event', done => {
			sendMutation(`
				deleteUpcomingClass ( token: "${LOCAL_LEARNERS_TEST_USER.token}", _id: "${UPCOMING_CLASS_ID}") {
					_id,
					status
				}
			`, data => {
				var { deleteUpcomingClass } = data
				assert(deleteUpcomingClass, 'deleteUpcomingClass should have data')

				var { _id, status } = deleteUpcomingClass
				assert(_id === UPCOMING_CLASS_ID, '_id should be ' + UPCOMING_CLASS_ID)
				assert(status === 'DELETE_SUCCESS', 'status should BE DELETE_SUCCESS')

				done()
			})
		})


	})
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//UserTests
////////////////////////////////////////////////////////////////////////////////////////////////////

function UserTests () {

	describe('User -', () => {


		// it('should create a test user', done => {
		// 	sendMutation(`
		// 		createUser ( name: "testuser" ) {
		// 			_id
		// 		}
		// 	`, data => {
		// 		var { _id } = data.createUser
		// 		assert(_id !== undefined, '_id should be defined')
		// 		// assert(name === 'testuser', 'name should equal testuser')
		// 		TEST_USER_ID = _id
		// 		done()
		// 	})
		// })

		// it('should delete the test user', done => {
		// 	sendMutation(`
		// 		deleteUser ( _id: "${TEST_USER_ID}" ) {
		// 			status
		// 		}
		// 	`, data => {
		// 		var { status } = data.deleteUser
		// 		assert(status === 'DELETE_SUCCESS', 'status should say DELETE_SUCCESS')
		// 		done()
		// 	})
		// })

		// it('should authenticate the local learners test user', async done => {
		// 	var user = await sendMutation(`
		// 		authenticate (meetupEmail: "locallearnersuser@gmail.com", meetupPassword: "thirstyscholar1") {
		// 			_id,
		// 			meetupMember {
		// 				id,
		// 				name
		// 			},
		// 			token
		// 		}
		// 	`)
		// 	var { _id, meetupMember, token } = user
		// 	var { id, name } = meetupMember

		// 	LOCAL_LEARNER_TEST_USER_TOKEN = token

		// 	assert.equal(name, 'Local Learners Test User')

		// 	done()
		// })


		it('should authenticate the local learners test user', done => {
			var meetupToken = LOCAL_LEARNERS_TEST_USER.meetup.token
			sendMutation(`
				authenticateViaMeetup ( token: "${meetupToken}" ) {
					_id,
					meetup {
						member {
							id,
							name
						},
						token
					},
					token
				}
			`, data => {
				assert(data.authenticateViaMeetup, 'authenticateViaMeetup should object')

				var { _id, meetup, token } = data.authenticateViaMeetup
				assert(_id !== undefined, '_id should exist')
				assert(meetup !== undefined, '_id should exist')
				assert(token !== undefined, 'user token should exist')

				var { member, token } = meetup
				assert(member !== undefined, 'member should exist')

				var { id, name } = member
				assert(id !== undefined, 'id should exist')
				assert(name === 'Local Learners Test User', 'name should say Local Learners Test User')


				global.LOCAL_LEARNERS_TEST_USER = data.authenticateViaMeetup

				done()
			})

		})

		it('should get the local learners test user', done => {
			var userToken = LOCAL_LEARNERS_TEST_USER.token
			var meetupToken = LOCAL_LEARNERS_TEST_USER.meetup.token

			sendQuery(`
				user ( token: "${userToken}" ) {
					_id,
					meetup {
						member {
							id,
							name
						},
						token
					},
					token
				}
			`, data => {
				assert(data.user, 'user should be object')

				var { _id, meetup, token } = data.user
				assert(_id !== undefined, '_id should exist')
				assert(meetup !== undefined, '_id should exist')
				assert(token === userToken, `user token (${token}) should be user token (${userToken})`)

				var { member, token } = meetup
				assert(member !== undefined, 'member should exist')
				assert(token === meetupToken, `meetup token (${token}) should be ${meetupToken}`)

				var { id, name } = member
				assert(id !== undefined, 'id should exist')
				assert(name === 'Local Learners Test User', 'name should say Local Learners Test User')

				done()
			})

		})

		// it('should log a user out', async done => {
		// 	sendMutation(`
		// 		logoutUser ( token: "${TEST_USER_BETA.token}" ) {
		// 			_id,
		// 			status
		// 		}
		// 	`, async data => {
		// 		// log(data)
		// 		var { logoutUser } = data
		// 		assert(logoutUser, 'logoutUser should contain data')

		// 		// var { _id, meetup, token } = data.authenticateViaMeetup
		// 		// assert(_id !== undefined, '_id should exist')
		// 		// assert(meetup !== undefined, '_id should exist')
		// 		// assert(token !== undefined, 'user token should exist')

		// 		// var { member, token } = meetup
		// 		// assert(member !== undefined, 'member should exist')
		// 		// assert(token !== undefined, 'meetup token should exist')

		// 		// var { id, name } = member
		// 		// assert(id !== undefined, 'id should exist')
		// 		// assert(name === 'Local Learners Test User', 'name should say Local Learners Test User')

		// 		done()
		// 	})


		// })



	})
}


