import { assert, expect } from 'chai'

import { sendQuery, sendMutation } from './test-server'
// import TestData from './test-data'


var LOCAL_LEARNER_TEST_USER_TOKEN, TEST_USER_ID

export default () => {

	describe('User -', () => {

		it('should create a test user', done => {
			sendMutation(`
				createUser ( name: "testuser" ) {
					_id,
					name
				}
			`, data => {
				var { _id, name } = data.createUser
				assert(_id !== undefined, '_id should be defined')
				assert(name === 'testuser', 'name should equal testuser')
				TEST_USER_ID = _id
				done()
			})
		})

		it('should delete the test user', done => {
			sendMutation(`
				deleteUser ( _id: "${TEST_USER_ID}" ) {
					status
				}
			`, data => {
				var { status } = data.deleteUser
				assert(status === 'DELETE_SUCCESS', 'status should say DELETE_SUCCESS')
				done()
			})
		})

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
