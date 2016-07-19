import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

export default () => {

	describe('Upcoming Classes -', () => {

		it('should create an upcoming class', done => {
			var name = `testupcomingclass ${new Date().toString()}`
			sendGraph(`
				mutation {
					createUpcomingClass (token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}", name: "${name}") {
						_id,
						event {
							id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)

				var { _id, name } = res.body.data.createUpcomingClass

				expect(_id).to.exist
				expect(name).to.equal(name)

				TestData.TEST_UPCOMING_CLASS_ID = _id

				done()
			})
		})

		it('should retrieve all upcoming classes', done => {
			sendGraph(`
				query {
					upcomingClasses {
						_id
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)

				// var { _id, event } = res.body.data.upcomingClass
				// var { _id, event } = res.body.data.upcomingClass
				// var { name } = event

				// expect(_id).to.exist
				// expect(name).to.equal('testupcomingclass')

				var upcomingClasses = res.body.data.upcomingClasses
				assert(Array.isArray(upcomingClasses), 'upcomingClasses returned is not array')
				assert(upcomingClasses.length > 0, 'upcomingClasses array returned is empty')

				done()
			})
		})

		it('should retrieve an upcoming class', done => {
			sendGraph(`
				query {
					upcomingClass ( _id: "${TestData.TEST_UPCOMING_CLASS_ID}") {
						_id,
						event {
							id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)

				var { _id, event } = res.body.data.upcomingClass
				var { _id, event } = res.body.data.upcomingClass
				var { name } = event

				expect(_id).to.exist
				expect(name).to.exist

				done()
			})
		})

		it('should delete an upcoming class and its event', done => {
			// TestData.TEST_UPCOMING_CLASS_ID = '57886c7960900661604f7a5d'
			
			sendGraph(`
				mutation {
					deleteUpcomingClass ( token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}", _id: "${TestData.TEST_UPCOMING_CLASS_ID}") {
						_id,
						status
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)

				var { _id, status } = res.body.data.deleteUpcomingClass

				expect(_id).to.equal(TestData.TEST_UPCOMING_CLASS_ID)
				expect(status).to.equal('DELETE_SUCCESS')

				done()
			})
		})


	})
}

