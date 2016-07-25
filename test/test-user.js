import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

export default () => {

	describe('User -', () => {

		it('should authenticate the local learners test user', done => {
			sendGraph(`
				mutation {
					authenticate (meetupEmail: "locallearnersuser@gmail.com", meetupPassword: "thirstyscholar1") {
						_id,
						meetupMember {
							id,
							name
						},
						token
					}
				}
			`)
			.end((err, res) => {
				log(res.body)
				var { _id, meetupMember, token } = res.body.data.authenticate
				var { id, name } = meetupMember

				TestData.LOCAL_LEARNER_TEST_USER_TOKEN = token

				assert.equal(name, 'Local Learners Test User')

				done()
			})
		})


		it('should get the user given a token', done => {
			sendGraph(`
				query {
					user (token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}") {
						_id,
						meetupMember {
							id,
							name
						},
						token
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { _id, meetupMember } = res.body.data.user
				var { id, name, token } = meetupMember

				expect(_id).to.exist
				expect(id).to.exist
				expect(name).to.exist
				done()
			})
		})


	})
}
