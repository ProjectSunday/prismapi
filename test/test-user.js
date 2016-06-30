import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

export default () => {

	describe('User', () => {

		it('should authenticate the local learners test user', done => {
			sendGraph(`
				mutation {
					authenticateUser (token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}") {
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
				// log(res.body, 'authenticateUser')
				var { token, name } = res.body.data.authenticateUser.meetupMember
				assert.equal(res.body.data.authenticateUser.meetupMember.name, 'Local Learners Test User')

				var { _id } = res.body.data.authenticateUser
				// log(_id, "test user id")
				done()
			})
		})

		it('should fetch the local learners test user\'s self', done => {
			sendGraph(`
				query {
					self (token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}") {
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


	})
}

