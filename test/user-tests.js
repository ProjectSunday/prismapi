import { assert, expect } from 'chai'

import { sendQuery, sendMutation } from './test-server'

// import { createTestUserBeta, deleteTestUserBeta } from './mocks'
// var LOCAL_LEARNER_TEST_USER_TOKEN

export default () => {

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
			sendMutation(`
				authenticateViaMeetup ( token: "${LOCAL_LEARNERS_TEST_USER.meetup.token}" ) {
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
				assert(token !== undefined, 'meetup token should exist')

				var { id, name } = member
				assert(id !== undefined, 'id should exist')
				assert(name === 'Local Learners Test User', 'name should say Local Learners Test User')

				done()
			})

		})

		it('should log a user out', async done => {
			sendMutation(`
				logoutUser ( token: "${TEST_USER_BETA.token}" ) {
					_id,
					status
				}
			`, async data => {
				// log(data)
				var { logoutUser } = data
				assert(logoutUser, 'logoutUser should contain data')

				// var { _id, meetup, token } = data.authenticateViaMeetup
				// assert(_id !== undefined, '_id should exist')
				// assert(meetup !== undefined, '_id should exist')
				// assert(token !== undefined, 'user token should exist')

				// var { member, token } = meetup
				// assert(member !== undefined, 'member should exist')
				// assert(token !== undefined, 'meetup token should exist')

				// var { id, name } = member
				// assert(id !== undefined, 'id should exist')
				// assert(name === 'Local Learners Test User', 'name should say Local Learners Test User')

				done()
			})


		})


		// it('should get the user given a token', async done => {
		// 	var user = await sendQuery(`
		// 		user (token: "${LOCAL_LEARNER_TEST_USER_TOKEN}") {
		// 			_id,
		// 			meetupMember {
		// 				id,
		// 				name
		// 			},
		// 			token
		// 		}
		// 	`)
		// 	var { _id, meetupMember } = user
		// 	var { id, name, token } = meetupMember

		// 	expect(_id).to.exist()
		// 	expect(id).to.exist
		// 	expect(name).to.exist

		// 	done()

		// })


	})
}
