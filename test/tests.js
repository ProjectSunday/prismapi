import { assert } from 'chai'
import supertest from 'supertest'

import '../debug'

import { sendQuery, sendMutation, TestServer } from './test-server'
import { getCategoryByName, getTestUserAlpha, createTestUserBeta, deleteTestUserBeta, getLocalLearnersTestUser } from './mocks'

describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		await TestServer.start()
		global.LOCAL_LEARNERS_TEST_USER = await getLocalLearnersTestUser()
		global.TEST_USER_ALPHA = await getTestUserAlpha()
		global.TEST_USER_BETA = await createTestUserBeta()
		try {

			global.CATEGORY_TECHNOLOGY = await getCategoryByName('Technology')
		} catch (er) {
			console.log(er)
		}
		done()
	})

	// TestingTests()

	UserTests()

	// CategoryTests()
	
	// RequestedClassTests()

	UpcomingClassTests()


	after(async (done) => {
		await deleteTestUserBeta({ _id: TEST_USER_BETA._id })
		await TestServer.stop()
		done()
	})
})


////////////////////////////////////////////////////////////////////////////////////////////////////
//CategoryTests
////////////////////////////////////////////////////////////////////////////////////////////////////
function CategoryTests() {
	describe('Category -', () => {

		it('should return all categories', done => {
			sendQuery(`
				categories {
					_id,
					name
				}
			`, data => {
				// log(data, 'data')
				var { categories } = data
				assert(Array.isArray(categories), 'categories should be an array')
				assert(categories.length, 'categories should not be empty')

				done()
			})
		})

		// it('should return all categories', (done) => {
		// 	sendQuery(`
		// 		categories {
		// 			_id,
		// 			name
		// 		}
		// 	`, data => {
		// 		console.log('data', data)
		// 		// done()
		// 	})
		// })

		// it('should create a category', done => {
		// 	sendGraph(`
		// 		mutation {
		// 			createCategory (name: "testtesttest") {
		// 				_id,
		// 				name
		// 			}
		// 		}
		// 	`)
		// 	.end((err, res) => {
		// 		// log(res.body)
		// 		var { name, _id } = res.body.data.createCategory
		// 		assert(name === 'testtesttest', 'name is not testtesttest')
		// 		assert(_id !== undefined, '_id is undefined')
		// 		CATEGORY_ID_TO_DELETE = _id
		// 		done()
		// 	})
		// })

		// it('should delete a category', done => {
		// 	sendGraph(`
		// 		mutation {
		// 			deleteCategory(_id: "${CATEGORY_ID_TO_DELETE}") {
		// 				status
		// 			}
		// 		}
		// 	`)
		// 	.end((err, res) => {
		// 		// log(res.body)
		// 		var { status } = res.body.data.deleteCategory
		// 		assert(status === 'DELETE_SUCCESS', 'status not DELETE_SUCCESS')
		// 		done()
		// 	})
		// })

	})
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//RequestedClassTests
////////////////////////////////////////////////////////////////////////////////////////////////////
function RequestedClassTests() {

	var REQUESTED_CLASS_ID
	describe('Requested Classes -', () => {

		it('should create a requested class', done => {
			sendMutation(`
				createRequestedClass ( 
					token: "${LOCAL_LEARNERS_TEST_USER.token}", 
					name: "testrequestedclass",
					categoryId: "${CATEGORY_TECHNOLOGY._id}" 
				) {
					_id,
					name,
					category {
						_id,
						name,
						imageName
					}
				}
			`, data => {
				var { createRequestedClass } = data
				assert(createRequestedClass, 'createRequestedClass should contain data')

				var { _id, name, category } = createRequestedClass
				assert(_id !== undefined, '_id should be defined')
				REQUESTED_CLASS_ID = _id
				assert(name === 'testrequestedclass', 'name should be testrequestedclass')
				assert(category, 'category should have data')

				var { _id, name, imageName } = category
				assert(_id !== undefined, '_id should exist')
				assert(name === CATEGORY_TECHNOLOGY.name, 'name should be ' + CATEGORY_TECHNOLOGY.name)
				assert(imageName === CATEGORY_TECHNOLOGY.imageName, 'name should be ' + CATEGORY_TECHNOLOGY.imageName)

				done()
			})
		})

		it('should return all requested classes', done => {
			sendQuery(`
				requestedClasses {
					_id,
				}
			`, data => {
				var { requestedClasses } = data
				assert(requestedClasses, 'requestedClasses should exist')
				assert(requestedClasses[0]._id, 'first requestedClasses _id should exist')

				done()
			})
		})

		it('should add an interested user', done => {
			sendMutation(`
				addInterestedUser ( token: "${TEST_USER_ALPHA.token}", _id: "${REQUESTED_CLASS_ID}" ) {
					_id,
					name,
					interested {
						_id,
						meetup {
							member {
								name
							}
						}
					}
				}
			`, data => {
				var { addInterestedUser } = data
				assert(addInterestedUser, 'addInterestedUser should contain data')

				var { _id, name, interested } = addInterestedUser
				assert(_id === REQUESTED_CLASS_ID, '_id should be ' + REQUESTED_CLASS_ID)
				assert(name === 'testrequestedclass', 'class name should be testrequestedclass')
				assert(Array.isArray(interested), 'interested list should be array')
				assert(interested.length === 2, 'there should be two people interested now')

				done()
			})
		})

		it('should remove an interested user to a requested class', done => {
			sendMutation(`
				removeInterestedUser ( token: "${TEST_USER_ALPHA.token}", _id: "${REQUESTED_CLASS_ID}" ) {
					_id,
					name,
					interested {
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
				var { removeInterestedUser } = data
				assert(removeInterestedUser, 'removeInterestedUser should contain data')

				var { _id, name, interested } = removeInterestedUser
				assert(_id === REQUESTED_CLASS_ID, '_id should be ' + REQUESTED_CLASS_ID)
				assert(name === 'testrequestedclass', 'class name should be testrequestedclass')
				assert(Array.isArray(interested), 'interested list should be an array')
				assert(interested.length === 1, 'interested list should be just one person')

				done()
			})
		})


		it('should delete a requested class', done => {
			sendMutation(`
				deleteRequestedClass(_id: "${REQUESTED_CLASS_ID}") {
					_id,
					status
				}
			`, data => {
				var { deleteRequestedClass } = data
				assert(deleteRequestedClass, 'deleteRequestedClass should contain data')

				var { _id, status } = deleteRequestedClass
				assert(_id === REQUESTED_CLASS_ID, '_id should be ' + REQUESTED_CLASS_ID)
				assert(status === 'DELETE_SUCCESS', 'status should be DELETE_SUCCESS')
				done()
			})
		})


	})
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//TestingTests
////////////////////////////////////////////////////////////////////////////////////////////////////
function TestingTests () {

	describe('Testing/Debugging/Fucking around', () => {

		it('do the thing', done => {
			sendQuery(`
				testing {
					result
				}
			`, data => {
				log(data, 'testing')
				done()
			})
		})

	})
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//UpcomingClassTests
////////////////////////////////////////////////////////////////////////////////////////////////////
function UpcomingClassTests () {
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


