import { assert, expect } from 'chai'

import { sendQuery, sendMutation } from './test-server'
// import TestData from './test-data'


var LOCAL_LEARNER_TEST_USER_TOKEN, TEST_USER_ID

export default () => {

	describe('User -', () => {

		it('should create a test user', async (done, fail) => {
			var user = await sendMutation(`
				createUser ( name: "testuser" ) {
					_id,
					name
				}
			`)

			var { _id, name } = user

			// log(user, 'user')
			try {
				assert(_id !== undefined, '_id should be defined')
				assert.equal(name, 'testuserasdf')
			done()

			} catch (err) {


				console.log('craps', err.message)
				fail()
				// throw "shit"
			}


		})

		// it('should delete the test user', async done => {

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
